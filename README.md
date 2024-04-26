## Flow Distribution Algorithm

The flow distribution algorithm ensures fair distribution of users among astrologers, while allowing adjustment of flow for top astrologers based on user preferences.

**Endpoints:**

1. `POST /api/distribute`
   - Distributes users among astrologers in a fair manner.
   - Request Body:

    ```json
     {
       "users": [],
       "astrologers": []
     }
    ```

   - Response: `{ "message": "Users distributed successfully" }`

2. `POST /api/adjust-flow`
   - Adjusts flow for top astrologers.
   - Request Body:

     ```json
     {
       "astrologerIds": [],
       "increaseFlow": true
     }
     ```

   - Response: `{ "message": "Flow adjusted for top astrologers" }`
