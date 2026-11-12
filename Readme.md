# IPO Diary --- API

The IPO Diary API provides backend services for the IPO Diary mobile
application. It supplies IPO information and supports the app's IPO
diary workflow, including records associated with family members and
broker accounts.

## Features

-   IPO data retrieval for the mobile app.
-   IPO lookup by identifier.
-   Synchronization of IPO information into the database from the
    configured source.
-   Backend support for recording and managing users' IPO diary
    information.
-   Device identification through the `x-device-id` request header.

## Tech Stack

-   Node.js
-   Express
-   TypeScript
-   MongoDB
-   Scheduled IPO data synchronization (cron-based)

## Prerequisites

-   Node.js and npm
-   MongoDB connection string
-   Access to the IPO data source used by the synchronization process

## Getting Started

### 1. Clone the repository

``` bash
git clone <your-api-repository-url>
cd <your-api-folder>
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Add the variable names used by
your current configuration.

Example template (replace or extend these names to match the
implementation):

``` env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Do not commit `.env` files or real credentials. Check the project's
configuration files for the exact required variable names.

### 4. Run the API

Use the scripts defined in `package.json`. Typical development and
production commands may look like:

``` bash
npm run dev
npm run build
npm start
```

If your repository uses different script names, use those instead.

## IPO Data Source

The project has used the following NSE endpoint to retrieve upcoming
issue data:

``` text
https://www.nseindia.com/api/all-upcoming-issues?category=ipo
```

The backend synchronization process stores IPO data in MongoDB so the
mobile app can retrieve it through the API.

**Important:** External endpoints, response formats, and access
requirements can change. Handle request failures and validate the source
response before updating stored IPO data.

## API Overview

The following operations are part of the project's known IPO data
workflow. Confirm the actual route paths and HTTP methods in the current
router files before publishing API documentation.

  -----------------------------------------------------------------------
  Operation                           Purpose
  ----------------------------------- -----------------------------------
  Get all IPOs                        Retrieve IPO records for the app,
                                      including the relevant IPO
                                      categories/statuses supported by
                                      the API.

  Get IPO by ID                       Retrieve a single IPO using its
                                      identifier.

  Sync IPO data                       Fetch IPO data from the configured
                                      source and synchronize it with the
                                      database.
  -----------------------------------------------------------------------

### Device Header

The mobile app sends a device identifier using:

``` http
x-device-id: <device-identifier>
```

Requests that pass through device-identification middleware should
include this header. Check the current middleware and route
configuration to determine which endpoints require it.

## Suggested API Documentation Format

For each route, document:

-   HTTP method and exact route path
-   Whether the `x-device-id` header is required
-   Query parameters and route parameters
-   Request body schema
-   Successful response format
-   Possible error responses and status codes

Do not assume route names or response properties from this overview; use
the actual Express router, controllers, validations, and response
classes as the source of truth.

## Deployment

The API has previously been deployed on Render. When deploying:

1.  Configure the production MongoDB connection string and other
    required environment variables.
2.  Set the correct build and start commands for the repository.
3.  Configure the mobile app to use the deployed API's HTTPS base URL.
4.  Check scheduled synchronization behavior and logs after deployment.
5.  Monitor availability and database connectivity.

On free hosting plans, the service may sleep or experience cold starts.
Account for this when handling the first request from the mobile app.

## Project Notes

-   This API is intended to support IPO record keeping; it does not
    place IPO applications with brokers.
-   Protect administrative or synchronization endpoints appropriately.
-   Validate external data before persisting it.
-   Avoid logging credentials, tokens, or sensitive user data.
-   Keep environment files and production secrets out of version
    control.

