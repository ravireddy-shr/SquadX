# SkillChain Pro - API Documentation

Complete API reference for SkillChain Pro smart contract and backend utilities.

## Smart Contract Methods

### Global Methods

#### `create()`
Initialize the SkillChain Pro application.

```python
@app.create
def create():
    """Initialize the application"""
    return app.initialize_global_state()
```

**When to call**: Once during app creation  
**Authorization**: App creator only  
**State modified**: Global state initialized  

---

### Certificate Management Methods

#### `bulk_issue_certificates()`
Issue a certificate to a student account. For bulk operations, call once per student.

```python
@app.external(authorize=Authorize.only(Global.creator_address()))
def bulk_issue_certificates(
    cert_id: abi.String,           # Unique certificate ID
    student_addr: abi.Address,     # Student's Algorand address
    aadhar_hash: abi.String,       # SHA-256 hash of Aadhar (64 hex chars)
    degree_type: abi.String,       # e.g., "B.Tech", "MBA"
    cgpa: abi.String,              # e.g., "8.5", "N/A"
    skillset: abi.String,          # Semicolon-separated: "Python;React;SQL"
    cert_type: abi.String,         # "degree", "certification", "coaching"
    institution: abi.String,       # Institution name
    *,
    output: abi.String
):
```

**Parameters**:
| Parameter | Type | Format | Example |
|-----------|------|--------|---------|
| cert_id | string | Alphanumeric | "CERT-2024-001" |
| student_addr | address | Algorand address | "AAAAAAAA...AY5HVY" |
| aadhar_hash | string | 64 hex characters | "4a80f60f0e..." |
| degree_type | string | Standard format | "B.Tech", "MBA" |
| cgpa | string | Numeric or N/A | "8.5", "N/A" |
| skillset | string | Semicolon-separated | "Python;React;SQL" |
| cert_type | string | Fixed options | "degree", "certification", "coaching" |
| institution | string | Full name | "IIT Delhi" |

**Returns**: `"Certificate issued successfully"`

**Errors**:
- `Assert failed: cert_id empty` - Certificate ID cannot be empty
- `Assert failed: invalid student address` - Student address must be valid

**Example**:
```typescript
const response = await client.call(app.bulk_issue_certificates, {
  cert_id: "CERT-2024-001",
  student_addr: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY",
  aadhar_hash: "4a80f60f0e5999d59b16c22b87e0ac13a2c9f0b5c8e0a7f2b3c4d5e6f7a8b9c",
  degree_type: "B.Tech Computer Science",
  cgpa: "8.5",
  skillset: "Python;React;SQL;Data Science",
  cert_type: "degree",
  institution: "IIT Delhi"
});
```

---

#### `verify_certificate(account)`
Check if a certificate is active for a given account.

```python
@app.external
def verify_certificate(account: abi.Address, *, output: abi.String):
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| account | address | Student's Algorand address |

**Returns**: Certificate ID if active

**Errors**:
- `Assert failed: certificate not active` - Certificate revoked or not issued

**Example**:
```typescript
const certId = await client.call(app.verify_certificate, {
  account: studentAddress
});
```

---

#### `revoke_certificate(account)`
Revoke a certificate for a student.

```python
@app.external(authorize=Authorize.only(Global.creator_address()))
def revoke_certificate(account: abi.Address, *, output: abi.String):
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| account | address | Student's address |

**Returns**: `"Certificate revoked"`

**Authorization**: App creator only

**Example**:
```typescript
const response = await client.call(app.revoke_certificate, {
  account: studentAddress
});
```

---

#### `get_certificate_by_aadhar_hash(hash, account)`
Retrieve certificate using Aadhar hash for privacy-preserving verification.

```python
@app.external
def get_certificate_by_aadhar_hash(
    hash: abi.String,
    account: abi.Address,
    *,
    output: abi.String
):
```

**Parameters**:
| Parameter | Type | Format | Description |
|-----------|------|--------|-------------|
| hash | string | 64 hex chars | SHA-256 of Aadhar |
| account | address | Algorand address | Student address |

**Returns**: Certificate ID if hash matches

**Errors**:
- `Assert failed: hash mismatch` - Provided hash doesn't match stored hash

**Use Case**: Privacy-first verification without exposing raw Aadhar

**Example**:
```typescript
const aadhar = "123456789012";
const hash = await hashAadhar(aadhar); // SHA-256 client-side
const certId = await client.call(app.get_certificate_by_aadhar_hash, {
  hash: hash,
  account: studentAddress
});
```

---

#### `get_certificate_details(account)`
Get full certificate details for a student.

```python
@app.external
def get_certificate_details(
    account: abi.Address,
    *,
    output: abi.String
):
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| account | address | Student's address |

**Returns**: Concatenated details string:
```
CERT-ID | Degree | CGPA | Institution
```

**Example Result**:
```
CERT-2024-001 | B.Tech Computer Science | 8.5 | IIT Delhi
```

**Example**:
```typescript
const details = await client.call(app.get_certificate_details, {
  account: studentAddress
});
// Parse the pipe-separated string
const [certId, degree, cgpa, institution] = details.split(' | ');
```

---

## Frontend Utilities

### Hash Module (`utils/hash.ts`)

#### `hashAadhar(aadhar: string): Promise<string>`
Hash a 12-digit Aadhar using SHA-256 client-side.

```typescript
import { hashAadhar } from '@/utils/hash';

const hash = await hashAadhar('123456789012');
// Returns: "4a80f60f0e5999d59b16c22b87e0ac13a2c9f0b5c8e0a7f2b3c4d5e6f7a8b9c"
```

**Parameters**:
- `aadhar`: 12-digit string (spaces trimmed automatically)

**Returns**: 64-character hex string (SHA-256 hash)

**Security**: Only runs client-side, never transmitted raw

**Validation Schemas**:

```typescript
import { AadharSchema, CertificateSchema, BulkCertificateSchema } from '@/utils/hash';

// Validate single aadhar
AadharSchema.parse('123456789012'); // ✅
AadharSchema.parse('12345');        // ❌ Too short

// Validate certificate data
CertificateSchema.parse({
  student_address: 'AAAA...AY5HVY',
  aadhar_hash: '4a80f60f...',
  // ... other fields
});

// Validate bulk CSV data
const validated = BulkCertificateSchema.parse(csvData);
```

---

### Algorand Module (`utils/algorand.ts`)

#### `connectWallet(): Promise<string[] | null>`
Connect Pera Wallet and get list of accounts.

```typescript
import { connectWallet } from '@/utils/algorand';

const accounts = await connectWallet();
if (accounts) {
  const userAddress = accounts[0];
}
```

**Returns**: Array of account addresses or null if connection failed

---

#### `getAccountInfo(address: string)`
Fetch account information from Algorand blockchain.

```typescript
import { getAccountInfo } from '@/utils/algorand';

const info = await getAccountInfo('AAAA...AY5HVY');
// Returns: { amount: 1000000, apps: {...}, created_apps: [...] }
```

**Returns**: Account state object from blockchain

---

#### `isValidAlgorandAddress(address: string): boolean`
Validate Algorand address format.

```typescript
import { isValidAlgorandAddress } from '@/utils/algorand';

isValidAlgorandAddress('AAAA...AY5HVY');  // true
isValidAlgorandAddress('invalid');       // false
```

---

#### `getExplorerLink(address: string, type?: 'account' | 'transaction'): string`
Generate link to Algorand TestNet Explorer.

```typescript
import { getExplorerLink } from '@/utils/algorand';

const accountLink = getExplorerLink('AAAA...AY5HVY', 'account');
// Returns: "https://testnet.algoexplorer.io/address/AAAA...AY5HVY"

const txLink = getExplorerLink('TX123ABC', 'transaction');
// Returns: "https://testnet.algoexplorer.io/tx/TX123ABC"
```

---

### PDF Module (`utils/pdf.ts`)

#### `generateCertificatePDF(data: CertificatePDFData): void`
Generate downloadable PDF certificate.

```typescript
import { generateCertificatePDF } from '@/utils/pdf';

generateCertificatePDF({
  certificateId: 'CERT-2024-001',
  studentName: 'John Doe',
  degree: 'B.Tech Computer Science',
  cgpa: '8.5',
  institution: 'IIT Delhi',
  issueDate: 'Mar 2024',
  skills: ['Python', 'React', 'SQL'],
  explorerLink: 'https://testnet.algoexplorer.io/address/...'
});
// Downloads: Certificate_CERT-2024-001.pdf
```

---

#### `downloadCandidateReport(candidateData, fileName): void`
Generate candidate report PDF for employers.

```typescript
import { downloadCandidateReport } from '@/utils/pdf';

downloadCandidateReport({
  name: 'Alice Johnson',
  email: 'alice@example.com',
  degree: 'B.Tech',
  institution: 'IIT Bombay',
  cgpa: '8.8',
  skills: ['Python', 'Machine Learning', 'TensorFlow'],
  matchScore: 92.5
}, 'alice-johnson-report.pdf');
```

---

## Custom Hooks

### `useWallet()`
Manage Pera Wallet connection state.

```typescript
import { useWallet } from '@/hooks/useWallet';

const { account, connect, disconnect, isConnecting } = useWallet();

if (account) {
  <p>Connected: {account}</p>
} else {
  <button onClick={connect}>Connect Wallet</button>
}
```

**Returns**:
- `account`: Connected address (null if disconnected)
- `connect`: Function to initiate connection
- `disconnect`: Function to disconnect wallet
- `isConnecting`: Loading state

---

### `useAlgorand()`
Fetch account information from blockchain.

```typescript
import { useAlgorand } from '@/hooks/useAlgorand';

const { getAccountInfo, loading, error, clearError } = useAlgorand();

const handleCheck = async () => {
  const info = await getAccountInfo(address);
  if (info) {
    console.log('Account balance:', info.amount);
  }
};
```

**Returns**:
- `getAccountInfo`: Async function to fetch account data
- `loading`: Loading state
- `error`: Error message if request failed
- `clearError`: Function to clear error

---

## Type Definitions

### CertificatePDFData
```typescript
interface CertificatePDFData {
  certificateId: string;
  studentName: string;
  degree: string;
  cgpa: string;
  institution: string;
  issueDate: string;
  skills: string[];
  explorerLink: string;
}
```

### Certificate (from Zod)
```typescript
interface Certificate {
  student_address: string;      // Algorand address
  aadhar_hash: string;         // 64-char hex string
  degree_type: string;         // e.g., "B.Tech"
  cgpa: string;               // e.g., "8.5"
  skillset: string;           // Semicolon-separated
  certification_type: string;  // "degree" | "certification" | "coaching"
  institution_name: string;   // Institution name
}
```

---

## Error Handling

### Common Errors & Solutions

**Wallet Connection**
```typescript
try {
  const accounts = await connectWallet();
} catch (error) {
  console.error('Wallet error:', error.message);
  // Show user-friendly message in UI
}
```

**Contract Execution**
```typescript
try {
  await client.call(app.bulk_issue_certificates, {...});
} catch (error) {
  if (error.message.includes('Validation')) {
    // Validation failed - check input data
  } else if (error.message.includes('denied')) {
    // User rejected transaction
  }
}
```

**Hashing**
```typescript
try {
  const hash = await hashAadhar(aadhar);
} catch (error) {
  console.error('Hashing failed:', error);
}
```

---

## Rate Limiting & Best Practices

1. **Batch Operations**: Use bulk_issue_certificates to process multiple at once
2. **Client-Side Hashing**: Always hash Aadhar client-side before transmission
3. **Error Boundaries**: Wrap dashboard pages with ErrorBoundary component
4. **Input Validation**: Use Zod schemas before submitting to contract
5. **Pagination**: Limit results to 10-50 items per query

---

## Integration Example

Complete end-to-end example:

```typescript
import { useWallet } from '@/hooks/useWallet';
import { hashAadhar, CertificateSchema } from '@/utils/hash';
import { getExplorerLink } from '@/utils/algorand';

export async function verifyCertificate(aadharInput: string) {
  // 1. Validate input
  const validated = AadharSchema.parse(aadharInput);
  
  // 2. Hash client-side
  const aadharHash = await hashAadhar(validated);
  
  // 3. Get user's wallet
  const { account } = useWallet();
  
  // 4. Call smart contract
  const certId = await client.call(
    app.get_certificate_by_aadhar_hash,
    { hash: aadharHash, account }
  );
  
  // 5. Generate explorer link
  const link = getExplorerLink(certId, 'transaction');
  
  return { aadharHash, certId, link };
}
```

---

## Support

For questions or issues:
1. Check [README.md](./README.md) for general info
2. See [QUICK_START.md](./QUICK_START.md) for setup help
3. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
