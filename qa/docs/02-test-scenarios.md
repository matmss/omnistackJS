# DevRadar — BDD Test Scenarios

Written in Gherkin. These are the human-readable scenario source of truth — the executable `.feature` files in the automation scaffold (`/backend-tests`, `/web-tests`, `/mobile-tests`) mirror these 1:1. Each scenario references the Requirement ID(s) it verifies.

## Feature: Developer Registration (Backend) — covers FR-1

```gherkin
Feature: Developer registration
  As the DevRadar API
  I want to register a developer with their GitHub profile and location
  So that they become discoverable to nearby developers

  Background:
    Given the developer database is empty

  Scenario: Register a new developer with a valid GitHub username
    Given "gaearon" is a valid GitHub username
    When I submit a registration with github_username "gaearon", techs "ReactJS,Redux", latitude "-23.5505" and longitude "-46.6333"
    Then the response status should be 200
    And the response should include the developer's name, avatar_url and bio from GitHub
    And the developer's techs should be ["ReactJS", "Redux"]
    And the developer should be persisted with a GeoJSON location of type "Point"

  Scenario: Registering the same GitHub username twice does not duplicate
    Given a developer already exists with github_username "gaearon"
    When I submit a registration with github_username "gaearon", techs "Node.js", latitude "-23.5505" and longitude "-46.6333"
    Then the response status should be 200
    And exactly 1 developer with github_username "gaearon" should exist in the database
    And the original techs should be unchanged

  Scenario: Registration triggers a real-time notification to a matching nearby listener
    Given a client is connected via WebSocket at latitude "-23.5505", longitude "-46.6333" watching techs "ReactJS"
    When I submit a registration with github_username "gaearon", techs "ReactJS", latitude "-23.5510" and longitude "-46.6330"
    Then the connected client should receive a "new-dev" event
    And the event payload should contain github_username "gaearon"

  Scenario: Registration does not notify a listener outside the 10km radius
    Given a client is connected via WebSocket at latitude "-22.9068", longitude "-43.1729" watching techs "ReactJS"
    When I submit a registration with github_username "gaearon", techs "ReactJS", latitude "-23.5505" and longitude "-46.6333"
    Then the connected client should not receive a "new-dev" event

  Scenario: Registration does not notify a listener whose techs do not match
    Given a client is connected via WebSocket at latitude "-23.5505", longitude "-46.6333" watching techs "Python"
    When I submit a registration with github_username "gaearon", techs "ReactJS", latitude "-23.5505" and longitude "-46.6333"
    Then the connected client should not receive a "new-dev" event

  @edge
  Scenario Outline: Registration with invalid or missing input
    When I submit a registration with github_username "<username>", techs "<techs>", latitude "<lat>" and longitude "<lon>"
    Then the response status should be "<status>"

    Examples:
      | username | techs    | lat      | lon      | status |
      |          | ReactJS  | -23.5505 | -46.6333 | 400    |
      | ghost-user-does-not-exist-xyz | ReactJS | -23.5505 | -46.6333 | 404    |
      | gaearon  | ReactJS  | not-a-number | -46.6333 | 400 |
```

## Feature: Developer Listing (Backend) — covers FR-2

```gherkin
Feature: List all developers

  Scenario: Listing developers returns everyone regardless of location
    Given 3 developers exist scattered across different cities
    When I request the list of all developers
    Then the response status should be 200
    And the response should contain 3 developers
```

## Feature: Geospatial & Tech Search (Backend) — covers FR-3, NFR-1, NFR-2

```gherkin
Feature: Search developers by location and tech
  As a developer using DevRadar
  I want to find nearby developers who know specific technologies
  So that I can network with them

  Background:
    Given the following developers exist:
      | github_username | techs             | latitude  | longitude  |
      | near-match       | ReactJS,Node.js   | -23.5505  | -46.6333   |
      | near-no-tech     | Python            | -23.5506  | -46.6334   |
      | far-match        | ReactJS           | -22.9068  | -43.1729   |

  Scenario: Search returns only nearby developers with a matching tech
    When I search at latitude "-23.5505", longitude "-46.6333" for techs "ReactJS"
    Then the response should contain exactly 1 developer
    And the response should include "near-match"

  Scenario: Search excludes developers outside the 10km radius even with matching tech
    When I search at latitude "-23.5505", longitude "-46.6333" for techs "ReactJS"
    Then the response should not include "far-match"

  Scenario: Search excludes nearby developers without a matching tech
    When I search at latitude "-23.5505", longitude "-46.6333" for techs "ReactJS"
    Then the response should not include "near-no-tech"

  @edge
  Scenario: Search with a tech nobody has returns an empty list
    When I search at latitude "-23.5505", longitude "-46.6333" for techs "COBOL"
    Then the response should contain exactly 0 developers

  @regression
  Scenario: A developer exactly at the 10km boundary
    Given a developer "boundary-dev" exists exactly 10.0km from latitude "-23.5505", longitude "-46.6333" with techs "ReactJS"
    When I search at latitude "-23.5505", longitude "-46.6333" for techs "ReactJS"
    Then the inclusion of "boundary-dev" should match the documented $maxDistance boundary behavior (inclusive/exclusive — see NFR-2)
```

## Feature: Web — Developer Registration Form — covers FR-5

```gherkin
Feature: Register a developer from the web app

  Scenario: Browser geolocation pre-fills the coordinates
    Given the browser grants geolocation permission
    When I open the DevRadar web app
    Then the latitude and longitude fields should be pre-filled with the browser's coordinates

  Scenario: Submitting the form adds the developer to the visible list without a page reload
    Given I am on the DevRadar web app
    When I fill in github username "gaearon", techs "ReactJS,Redux" and submit
    Then a new entry for "gaearon" should appear in the developer list
    And the form's username and techs fields should be cleared

  @edge
  Scenario: Geolocation permission denied still allows manual entry
    Given the browser denies geolocation permission
    When I open the DevRadar web app
    And I manually fill in latitude "-23.5505" and longitude "-46.6333"
    And I fill in github username "gaearon" and techs "ReactJS" and submit
    Then a new entry for "gaearon" should appear in the developer list

  Scenario: Developer list loads existing developers on page load
    Given 2 developers are already registered in the backend
    When I open the DevRadar web app
    Then the developer list should show 2 entries
```

## Feature: Mobile — Map Search & Live Updates — covers FR-6

```gherkin
Feature: Search and view developers on the map

  Scenario: App centers the map on the current device location
    Given location permission is granted
    When the app launches
    Then the map should be centered on the device's current coordinates

  Scenario: Searching by tech shows matching nearby developers as markers
    Given developers matching "ReactJS" exist within 10km
    When I enter "ReactJS" in the search field and tap search
    Then markers for the matching developers should appear on the map

  Scenario: Tapping a marker shows the developer's callout details
    Given a developer marker is visible on the map
    When I tap the marker
    Then a callout should display the developer's name, bio and techs

  Scenario: Tapping the callout opens the GitHub profile
    Given a developer's callout is open
    When I tap the callout
    Then the app should navigate to the Profile screen
    And the Profile screen should load "https://github.com/<github_username>" in a WebView

  Scenario: A live "new-dev" event adds a marker without re-searching
    Given I have an active search for techs "ReactJS" centered on my region
    When a new developer matching "ReactJS" registers within 10km
    Then a new marker should appear on the map without me tapping search again

  @edge
  Scenario: Location permission denied
    Given location permission is denied
    When the app launches
    Then the app should not crash
    And the map should not attempt to render without a region
```

## Cross-cutting / Integration Scenarios — covers FR-4, NFR-3

```gherkin
Feature: End-to-end real-time propagation across layers

  Scenario: A web registration is seen live by a connected mobile client
    Given a mobile client has an active search/WebSocket connection near São Paulo for techs "ReactJS"
    When a developer matching "ReactJS" is registered via the web app near São Paulo
    Then the mobile client should receive the update within 2 seconds

  Scenario: GitHub API is used consistently as the source of truth for profile data
    When a developer is registered via web and the same data is later fetched via the mobile search
    Then the name, avatar_url and bio should be identical across both responses
```

## Exploratory testing charters (session-based, not scripted)

| Charter | Area | Time-box |
|---|---|---|
| Explore the registration form with unexpected input (emoji, extremely long strings, SQL/NoSQL injection-like strings in `techs` and `github_username`) | Web + Backend | 30 min |
| Explore rapid repeated registrations of the same username (race condition on the `findOne` → `create` check in `DevController.store`) | Backend | 30 min |
| Explore map behavior when panning/zooming rapidly while a search is in flight | Mobile | 30 min |
| Explore WebSocket behavior across app backgrounding/foregrounding and connectivity loss | Mobile | 45 min |
| Explore GitHub API failure modes (rate limit, deleted account, private/renamed account) | Backend | 30 min |
