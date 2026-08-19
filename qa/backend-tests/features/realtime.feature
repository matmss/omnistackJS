Feature: Real-time propagation of new developers via WebSocket
  As a connected client
  I want to be notified when a matching developer registers nearby
  So that I see updates without manually re-searching

  Background:
    Given the developer database is empty

  @integration @smoke @P1
  Scenario: Registration triggers a real-time notification to a matching nearby listener
    Given "gaearon" is a valid GitHub username
    And a client "watcher" is connected via WebSocket at latitude "-23.5505", longitude "-46.6333" watching techs "ReactJS"
    When I submit a registration with github_username "gaearon", techs "ReactJS", latitude "-23.5510" and longitude "-46.6330"
    Then client "watcher" should receive a "new-dev" event within 2 seconds
    And the event payload for "watcher" should contain github_username "gaearon"

  @integration @regression @P1
  Scenario: Registration does not notify a listener outside the 10km radius
    Given "gaearon" is a valid GitHub username
    And a client "far-watcher" is connected via WebSocket at latitude "-22.9068", longitude "-43.1729" watching techs "ReactJS"
    When I submit a registration with github_username "gaearon", techs "ReactJS", latitude "-23.5505" and longitude "-46.6333"
    Then client "far-watcher" should not receive a "new-dev" event within 2 seconds

  @integration @regression @P1
  Scenario: Registration does not notify a listener whose techs do not match
    Given "gaearon" is a valid GitHub username
    And a client "mismatched-watcher" is connected via WebSocket at latitude "-23.5505", longitude "-46.6333" watching techs "Python"
    When I submit a registration with github_username "gaearon", techs "ReactJS", latitude "-23.5505" and longitude "-46.6333"
    Then client "mismatched-watcher" should not receive a "new-dev" event within 2 seconds
