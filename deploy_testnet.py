import sys
import time
import os
import random
from algosdk import mnemonic, account
from algosdk.atomic_transaction_composer import AccountTransactionSigner
from algosdk.v2client import algod
from beaker.client import ApplicationClient

MNEMONIC = os.getenv("DEPLOYER_MNEMONIC", "").strip()
ALGOD_SERVER = os.getenv("ALGOD_SERVER", "").strip().rstrip("/")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "").strip()
ALGOD_API_HEADER_NAME = os.getenv("ALGOD_API_HEADER_NAME", "").strip()
ALGOD_API_HEADER_VALUE = os.getenv("ALGOD_API_HEADER_VALUE", "").strip()
DEFAULT_ENDPOINTS = [
    "https://testnet-api.4160.nodely.dev",
    "https://testnet-api.algonode.cloud",
    "https://testnet-api.algonode.network",
]

sys.path.insert(0, os.path.abspath(r"c:\Kred\contracts"))

from skillchain import app  # noqa: E402

if len(MNEMONIC.split()) != 25:
    raise SystemExit("Set a valid 25-word mnemonic in DEPLOYER_MNEMONIC")

endpoints = []
if ALGOD_SERVER:
    endpoints.append(ALGOD_SERVER)
for endpoint in DEFAULT_ENDPOINTS:
    if endpoint not in endpoints:
        endpoints.append(endpoint)

sk = mnemonic.to_private_key(MNEMONIC)
addr = account.address_from_private_key(sk)
signer = AccountTransactionSigner(sk)

local_algod = algod.AlgodClient("a" * 64, "http://localhost:4001")
app_spec = app.build(local_algod)

headers = {}
if ALGOD_API_HEADER_NAME and ALGOD_API_HEADER_VALUE:
    headers[ALGOD_API_HEADER_NAME] = ALGOD_API_HEADER_VALUE

last_err = None
for ep in endpoints:
    print(f"Trying endpoint: {ep}")
    client = algod.AlgodClient(ALGOD_TOKEN, ep, headers=headers or None)
    consecutive_failures = 0
    for i in range(20):
        try:
            app_client = ApplicationClient(client, app_spec, signer=signer, sender=addr)
            app_id, app_addr, tx_id = app_client.create()
            print(f"APP_ID={app_id}")
            print(f"APP_ADDR={app_addr}")
            print(f"TX_ID={tx_id}")
            raise SystemExit(0)
        except Exception as e:
            last_err = e
            consecutive_failures += 1
            msg = str(e)
            print(f"Attempt {i+1}/20 failed: {msg}")

            # Hard auth failures usually won't recover by retrying same endpoint.
            if "403" in msg:
                print("Got 403 (auth/access). Switching endpoint immediately.")
                break

            if consecutive_failures >= 2:
                print(f"Switching endpoint after {consecutive_failures} consecutive failures")
                break

            # Exponential backoff with jitter to reduce provider throttling
            wait_s = min(180, 10 * (2 ** min(i, 4))) + random.uniform(0, 5)
            print(f"Waiting {wait_s:.1f}s before retry")
            time.sleep(wait_s)

print(f"All retries failed. Last error: {last_err}")
raise SystemExit(1)
