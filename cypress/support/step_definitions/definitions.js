// you can have external state, and also require things!
const url = 'http://localhost:3000/';
const mailHog = 'http://staging.mailhog.clickyab.ae';
let email = '';

given('I open panel', () => {
  cy.visit(url);
});

given('I open mailhog', () => {
  cy.visit(mailHog);
});

then('Generate new email', () => {
  email = `test-user-${Date.now()}@clickyab.com`;
  console.log("Email:" + email);
});

then('Set {string} by email', (id) => {
  cy.get(`#${id}`).type(email);
});

then(`I see {string} in the title`, (title) => {
  cy.title().should('include', title);
});

then(`Set {string} as {string}`, (id, value) => {
  cy.get(`${id}`).type(value);
});


then(`Set {string} id as {string}`, (id, value) => {
  cy.get(`#${id}`).type(value);
});


then(`Set {string} class as {string}`, (className, value) => {
  cy.get(`.${className}`).type(value);
});


then(`Press {string}`, (btn) => {
  cy.get('form button').contains(btn).click();
});


then(`I see {string} in url`, (text) => {
  cy.url().should('contain', text);
});



then(`I click on {string}`, (selector) => {
  cy.get(selector).click();
});


then(`I open verification link`, (callback) => {

  cy.wait(2000);
  cy.get("#preview-html").then((iframe) => {
    const content = iframe.contents();
    const link = content.text().split("\n")[0].replace("http://staging.crab.clickyab.ae/", url);
    cy.visit(link);
  });

});


