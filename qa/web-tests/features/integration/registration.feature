Feature: Register a developer from the web app, against the real backend

  # Same user-facing behavior as features/registration.feature, but nothing here is mocked
  # at the browser level: the app talks to a real Express server backed by a real (ephemeral)
  # MongoDB. Only GitHub's third-party API is stubbed — see support/backend-server.js.

  @integration @smoke
  Scenario: Submitting the form persists the developer through the real API
    Given the browser grants geolocation permission at latitude "-23.5505" and longitude "-46.6333"
    And the real backend has no registered developers
    When I open the DevRadar web app
    And I fill in github username "gaearon", techs "ReactJS,Redux" and submit
    Then a new entry for "gaearon" should appear in the developer list
    And the github username field should be empty
    And the techs field should be empty
    And reloading the page should still show "gaearon" in the developer list

  @integration @regression
  Scenario: Developer list loads existing developers from the real database on page load
    Given the real backend has 2 registered developers
    When I open the DevRadar web app
    Then the developer list should show 2 entries
