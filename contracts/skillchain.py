"""
SkillChain Pro - Web3 Talent Verification Smart Contract
Algorand Testnet | Beaker + PyTEAL
"""
from beaker import *
from pyteal import *

class CertificateState:
    """Global and local state for certificate management"""
    # Global state
    total_certificates = GlobalStateValue(TealType.uint64, default=Int(0))
    institution_registry = GlobalStateValue(TealType.bytes, default=Bytes(""))

    # Local state (per account)
    certificate_id = LocalStateValue(TealType.bytes)
    issuer_address = LocalStateValue(TealType.bytes)
    student_address = LocalStateValue(TealType.bytes)
    aadhar_hash = LocalStateValue(TealType.bytes)
    degree_type = LocalStateValue(TealType.bytes)
    cgpa_or_percentage = LocalStateValue(TealType.bytes)
    skillset = LocalStateValue(TealType.bytes)
    certification_type = LocalStateValue(TealType.bytes)
    institution_name = LocalStateValue(TealType.bytes)
    issue_timestamp = LocalStateValue(TealType.uint64)
    status = LocalStateValue(TealType.bytes, default=Bytes("active"))


app = Application("SkillChainPro", state=CertificateState())


@app.create
def create():
    """Initialize the application"""
    return app.initialize_global_state()


@app.external(authorize=Authorize.only(Global.creator_address()))
def bulk_issue_certificates(
    cert_id: abi.String,
    student_addr: abi.Address,
    aadhar_hash: abi.String,
    degree_type: abi.String,
    cgpa: abi.String,
    skillset: abi.String,
    cert_type: abi.String,
    institution: abi.String,
    *,
    output: abi.String,
):
    """
    Issue a certificate to a student account.
    Only callable by the app creator (institution).
    """
    return Seq(
        [
            # Verify certificate_id is not empty
            Assert(cert_id.get() != Bytes("")),
            # Verify student address is valid
            Assert(student_addr.get() != Global.zero_address()),
            # Set certificate details in local state
            app.state.certificate_id[student_addr.get()].set(cert_id.get()),
            app.state.issuer_address[student_addr.get()].set(Txn.sender()),
            app.state.student_address[student_addr.get()].set(student_addr.get()),
            app.state.aadhar_hash[student_addr.get()].set(aadhar_hash.get()),
            app.state.degree_type[student_addr.get()].set(degree_type.get()),
            app.state.cgpa_or_percentage[student_addr.get()].set(cgpa.get()),
            app.state.skillset[student_addr.get()].set(skillset.get()),
            app.state.certification_type[student_addr.get()].set(cert_type.get()),
            app.state.institution_name[student_addr.get()].set(institution.get()),
            app.state.issue_timestamp[student_addr.get()].set(Global.latest_timestamp()),
            app.state.status[student_addr.get()].set(Bytes("active")),
            # Increment total certificates counter
            app.state.total_certificates.set(app.state.total_certificates + Int(1)),
            # Return success message
            output.set(Bytes("Certificate issued successfully")),
        ]
    )


@app.external
def verify_certificate(account: abi.Address, *, output: abi.String):
    """
    Verify if a certificate for the given account is active.
    Returns the certificate ID if active.
    """
    return Seq(
        [
            Assert(app.state.status[account.get()] == Bytes("active")),
            output.set(app.state.certificate_id[account.get()]),
        ]
    )


@app.external(authorize=Authorize.only(Global.creator_address()))
def revoke_certificate(account: abi.Address, *, output: abi.String):
    """
    Revoke a certificate by setting its status to 'revoked'.
    Only callable by the app creator.
    """
    return Seq(
        [
            app.state.status[account.get()].set(Bytes("revoked")),
            output.set(Bytes("Certificate revoked")),
        ]
    )


@app.external
def get_certificate_by_aadhar_hash(
    hash: abi.String, account: abi.Address, *, output: abi.String
):
    """
    Retrieve certificate ID for an account if the provided Aadhar hash matches.
    Provides privacy-preserving verification.
    """
    return Seq(
        [
            Assert(app.state.aadhar_hash[account.get()] == hash.get()),
            output.set(app.state.certificate_id[account.get()]),
        ]
    )


@app.external
def get_certificate_details(
    account: abi.Address, *, output: abi.String
):
    """Get full certificate details for an account"""
    return Seq(
        [
            Assert(app.state.status[account.get()] == Bytes("active")),
            output.set(
                Concat(
                    app.state.certificate_id[account.get()],
                    Bytes(" | "),
                    app.state.degree_type[account.get()],
                    Bytes(" | "),
                    app.state.cgpa_or_percentage[account.get()],
                    Bytes(" | "),
                    app.state.institution_name[account.get()],
                )
            ),
        ]
    )
