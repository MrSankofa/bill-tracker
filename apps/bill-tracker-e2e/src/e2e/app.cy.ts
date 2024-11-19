import { getTitle } from '../support/app.po';
// TODO: figure out why that import function did not work

describe('bill-tracker-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display Bill Tracker title', () => {
    // Custom command example, see `../support/commands.ts` file
    // todo: implement authentication
    // cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    cy.get('h1').contains(/Bill Tracker/);
  });
});
