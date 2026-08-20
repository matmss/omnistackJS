// Generated from: features/registration.feature
import { test } from "playwright-bdd";

test.describe('Register a developer from the web app', () => {

  test('Browser geolocation pre-fills the coordinates', { tag: ['@smoke', '@P2'] }, async ({ Given, When, Then, And, context, page }) => { 
    await Given('the browser grants geolocation permission at latitude "-23.5505" and longitude "-46.6333"', null, { context }); 
    await And('the backend has no registered developers', null, { page }); 
    await When('I open the DevRadar web app', null, { page }); 
    await Then('the latitude field should contain "-23.5505"', null, { page }); 
    await And('the longitude field should contain "-46.6333"', null, { page }); 
  });

  test('Submitting the form adds the developer to the visible list without a page reload', { tag: ['@smoke', '@P1'] }, async ({ Given, When, Then, And, context, page }) => { 
    await Given('the browser grants geolocation permission at latitude "-23.5505" and longitude "-46.6333"', null, { context }); 
    await And('the backend has no registered developers', null, { page }); 
    await And('the backend will accept a new registration for "gaearon"', null, { page }); 
    await When('I open the DevRadar web app', null, { page }); 
    await And('I fill in github username "gaearon", techs "ReactJS,Redux" and submit', null, { page }); 
    await Then('a new entry for "gaearon" should appear in the developer list', null, { page }); 
    await And('the github username field should be empty', null, { page }); 
    await And('the techs field should be empty', null, { page }); 
  });

  test('Geolocation permission denied still allows manual entry', { tag: ['@edge', '@P2'] }, async ({ Given, When, Then, And, context, page }) => { 
    await Given('the browser denies geolocation permission', null, { context }); 
    await And('the backend has no registered developers', null, { page }); 
    await And('the backend will accept a new registration for "gaearon"', null, { page }); 
    await When('I open the DevRadar web app', null, { page }); 
    await And('I manually fill in latitude "-23.5505" and longitude "-46.6333"', null, { page }); 
    await And('I fill in github username "gaearon", techs "ReactJS" and submit', null, { page }); 
    await Then('a new entry for "gaearon" should appear in the developer list', null, { page }); 
  });

  test('Developer list loads existing developers on page load', { tag: ['@regression', '@P2'] }, async ({ Given, When, Then, page }) => { 
    await Given('the backend has 2 registered developers', null, { page }); 
    await When('I open the DevRadar web app', null, { page }); 
    await Then('the developer list should show 2 entries', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/registration.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":["@smoke","@P2"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given the browser grants geolocation permission at latitude \"-23.5505\" and longitude \"-46.6333\"","stepMatchArguments":[{"group":{"start":54,"value":"\"-23.5505\"","children":[{"start":55,"value":"-23.5505","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":79,"value":"\"-46.6333\"","children":[{"start":80,"value":"-46.6333","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And the backend has no registered developers","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I open the DevRadar web app","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the latitude field should contain \"-23.5505\"","stepMatchArguments":[{"group":{"start":34,"value":"\"-23.5505\"","children":[{"start":35,"value":"-23.5505","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And the longitude field should contain \"-46.6333\"","stepMatchArguments":[{"group":{"start":35,"value":"\"-46.6333\"","children":[{"start":36,"value":"-46.6333","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":14,"pickleLine":12,"tags":["@smoke","@P1"],"steps":[{"pwStepLine":15,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"Given the browser grants geolocation permission at latitude \"-23.5505\" and longitude \"-46.6333\"","stepMatchArguments":[{"group":{"start":54,"value":"\"-23.5505\"","children":[{"start":55,"value":"-23.5505","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":79,"value":"\"-46.6333\"","children":[{"start":80,"value":"-46.6333","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"And the backend has no registered developers","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"And the backend will accept a new registration for \"gaearon\"","stepMatchArguments":[{"group":{"start":47,"value":"\"gaearon\"","children":[{"start":48,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I open the DevRadar web app","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"And I fill in github username \"gaearon\", techs \"ReactJS,Redux\" and submit","stepMatchArguments":[{"group":{"start":26,"value":"\"gaearon\"","children":[{"start":27,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":43,"value":"\"ReactJS,Redux\"","children":[{"start":44,"value":"ReactJS,Redux","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then a new entry for \"gaearon\" should appear in the developer list","stepMatchArguments":[{"group":{"start":16,"value":"\"gaearon\"","children":[{"start":17,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And the github username field should be empty","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And the techs field should be empty","stepMatchArguments":[]}]},
  {"pwTestLine":25,"pickleLine":23,"tags":["@edge","@P2"],"steps":[{"pwStepLine":26,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Given the browser denies geolocation permission","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"And the backend has no registered developers","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"And the backend will accept a new registration for \"gaearon\"","stepMatchArguments":[{"group":{"start":47,"value":"\"gaearon\"","children":[{"start":48,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"When I open the DevRadar web app","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"And I manually fill in latitude \"-23.5505\" and longitude \"-46.6333\"","stepMatchArguments":[{"group":{"start":28,"value":"\"-23.5505\"","children":[{"start":29,"value":"-23.5505","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":53,"value":"\"-46.6333\"","children":[{"start":54,"value":"-46.6333","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":31,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"And I fill in github username \"gaearon\", techs \"ReactJS\" and submit","stepMatchArguments":[{"group":{"start":26,"value":"\"gaearon\"","children":[{"start":27,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":43,"value":"\"ReactJS\"","children":[{"start":44,"value":"ReactJS","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":32,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"Then a new entry for \"gaearon\" should appear in the developer list","stepMatchArguments":[{"group":{"start":16,"value":"\"gaearon\"","children":[{"start":17,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":35,"pickleLine":33,"tags":["@regression","@P2"],"steps":[{"pwStepLine":36,"gherkinStepLine":34,"keywordType":"Context","textWithKeyword":"Given the backend has 2 registered developers","stepMatchArguments":[{"group":{"start":16,"value":"2"},"parameterTypeName":"int"}]},{"pwStepLine":37,"gherkinStepLine":35,"keywordType":"Action","textWithKeyword":"When I open the DevRadar web app","stepMatchArguments":[]},{"pwStepLine":38,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"Then the developer list should show 2 entries","stepMatchArguments":[{"group":{"start":31,"value":"2"},"parameterTypeName":"int"}]}]},
]; // bdd-data-end