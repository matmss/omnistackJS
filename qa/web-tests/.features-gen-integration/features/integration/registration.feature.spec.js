// Generated from: features/integration/registration.feature
import { test } from "playwright-bdd";

test.describe('Register a developer from the web app, against the real backend', () => {

  test('Submitting the form persists the developer through the real API', { tag: ['@integration', '@smoke'] }, async ({ Given, When, Then, And, context, page }) => { 
    await Given('the browser grants geolocation permission at latitude "-23.5505" and longitude "-46.6333"', null, { context }); 
    await And('the real backend has no registered developers'); 
    await When('I open the DevRadar web app', null, { page }); 
    await And('I fill in github username "gaearon", techs "ReactJS,Redux" and submit', null, { page }); 
    await Then('a new entry for "gaearon" should appear in the developer list', null, { page }); 
    await And('the github username field should be empty', null, { page }); 
    await And('the techs field should be empty', null, { page }); 
    await And('reloading the page should still show "gaearon" in the developer list', null, { page }); 
  });

  test('Developer list loads existing developers from the real database on page load', { tag: ['@integration', '@regression'] }, async ({ Given, When, Then, page }) => { 
    await Given('the real backend has 2 registered developers'); 
    await When('I open the DevRadar web app', null, { page }); 
    await Then('the developer list should show 2 entries', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/integration/registration.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":8,"tags":["@integration","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given the browser grants geolocation permission at latitude \"-23.5505\" and longitude \"-46.6333\"","stepMatchArguments":[{"group":{"start":54,"value":"\"-23.5505\"","children":[{"start":55,"value":"-23.5505","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":79,"value":"\"-46.6333\"","children":[{"start":80,"value":"-46.6333","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And the real backend has no registered developers","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I open the DevRadar web app","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And I fill in github username \"gaearon\", techs \"ReactJS,Redux\" and submit","stepMatchArguments":[{"group":{"start":26,"value":"\"gaearon\"","children":[{"start":27,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":43,"value":"\"ReactJS,Redux\"","children":[{"start":44,"value":"ReactJS,Redux","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then a new entry for \"gaearon\" should appear in the developer list","stepMatchArguments":[{"group":{"start":16,"value":"\"gaearon\"","children":[{"start":17,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the github username field should be empty","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the techs field should be empty","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And reloading the page should still show \"gaearon\" in the developer list","stepMatchArguments":[{"group":{"start":37,"value":"\"gaearon\"","children":[{"start":38,"value":"gaearon","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":17,"pickleLine":19,"tags":["@integration","@regression"],"steps":[{"pwStepLine":18,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given the real backend has 2 registered developers","stepMatchArguments":[{"group":{"start":21,"value":"2"},"parameterTypeName":"int"}]},{"pwStepLine":19,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I open the DevRadar web app","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then the developer list should show 2 entries","stepMatchArguments":[{"group":{"start":31,"value":"2"},"parameterTypeName":"int"}]}]},
]; // bdd-data-end