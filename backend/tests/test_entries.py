from fastapi.testclient import TestClient

def test_create_and_get_entry(client: TestClient, user_token_headers: dict):
    # Create
    response = client.post(
        "/api/entries",
        headers=user_token_headers,
        json={"title": "My Entry", "content": "Content here"}
    )
    assert response.status_code == 201
    entry_id = response.json()["id"]

    # Get
    response2 = client.get(
        f"/api/entries/{entry_id}",
        headers=user_token_headers
    )
    assert response2.status_code == 200
    assert response2.json()["title"] == "My Entry"

def test_search_entries(client: TestClient, user_token_headers: dict):
    # Create multiple
    client.post("/api/entries", headers=user_token_headers, json={"title": "Apple", "content": "Red"})
    client.post("/api/entries", headers=user_token_headers, json={"title": "Banana", "content": "Yellow"})
    
    # Search
    response = client.get("/api/entries?q=Apple", headers=user_token_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Apple"

