"""
Unit tests for SkillChain Pro smart contract
Uses pytest + algokit testing utilities
"""
import pytest
from algosdk.v2client import algod
from beaker.client import ApplicationClient
from skillchain import app
import hashlib


@pytest.fixture
def app_client():
    """Create an ApplicationClient for testing"""
    client = algod.AlgodClient(
        algod_token="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        algod_address="http://localhost:4001",
    )
    return ApplicationClient(client, app)


def test_app_creation(app_client):
    """Test successful app creation"""
    response = app_client.create()
    assert response.confirmed_round is not None


def test_bulk_issue_certificates(app_client):
    """Test issuing a certificate"""
    app_client.create()

    cert_id = "CERT-001"
    student_addr = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY"
    aadhar_hash = hashlib.sha256(b"123456789012").hexdigest()
    degree_type = "B.Tech"
    cgpa = "8.5"
    skillset = "Python,React,SQL"
    cert_type = "degree"
    institution = "IIT Delhi"

    response = app_client.call(
        app.bulk_issue_certificates,
        cert_id=cert_id,
        student_addr=student_addr,
        aadhar_hash=aadhar_hash,
        degree_type=degree_type,
        cgpa=cgpa,
        skillset=skillset,
        cert_type=cert_type,
        institution=institution,
    )

    assert response.confirmed_round is not None


def test_verify_certificate(app_client):
    """Test certificate verification"""
    app_client.create()

    cert_id = "CERT-002"
    student_addr = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY"
    aadhar_hash = hashlib.sha256(b"123456789012").hexdigest()

    # Issue certificate first
    app_client.call(
        app.bulk_issue_certificates,
        cert_id=cert_id,
        student_addr=student_addr,
        aadhar_hash=aadhar_hash,
        degree_type="MBA",
        cgpa="7.9",
        skillset="Finance,Excel,PowerBI",
        cert_type="degree",
        institution="IIM Bangalore",
    )

    # Verify it
    response = app_client.call(app.verify_certificate, account=student_addr)
    assert response.confirmed_round is not None


def test_revoke_certificate(app_client):
    """Test certificate revocation"""
    app_client.create()

    cert_id = "CERT-003"
    student_addr = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY"

    # Issue certificate first
    app_client.call(
        app.bulk_issue_certificates,
        cert_id=cert_id,
        student_addr=student_addr,
        aadhar_hash=hashlib.sha256(b"123456789012").hexdigest(),
        degree_type="Certification",
        cgpa="N/A",
        skillset="Machine Learning,Python",
        cert_type="coaching",
        institution="Coursera",
    )

    # Revoke it
    response = app_client.call(app.revoke_certificate, account=student_addr)
    assert response.confirmed_round is not None


def test_get_certificate_by_aadhar_hash(app_client):
    """Test retrieving certificate by Aadhar hash"""
    app_client.create()

    cert_id = "CERT-004"
    student_addr = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY"
    aadhar_hash = hashlib.sha256(b"987654321098").hexdigest()

    # Issue certificate
    app_client.call(
        app.bulk_issue_certificates,
        cert_id=cert_id,
        student_addr=student_addr,
        aadhar_hash=aadhar_hash,
        degree_type="B.Tech",
        cgpa="8.5",
        skillset="Python,React,SQL",
        cert_type="degree",
        institution="IIT Delhi",
    )

    # Retrieve by hash
    response = app_client.call(
        app.get_certificate_by_aadhar_hash,
        hash=aadhar_hash,
        account=student_addr,
    )
    assert response.confirmed_round is not None
