import { Selector } from 'testcafe';
import { Grid, CardView, getEditInput, navBar, toolbarMenu } from '../page-model';
import { checkPopupsVisibility } from '../helpers';

fixture('Tasks')
    .page('https://demos.devexpress.com/RWA/DevAV/Tasks.aspx');

const mainGrid     = new Grid('TaskGrid');
const cardViewGrid = new CardView('TaskCardView');

test('Test Popups Visibility', async t => {
    //Check that no popup is not visible
    await checkPopupsVisibility();

    // click on toolbar document viewer button
    //Check that only PageViewer popup is visible
    await t.click(toolbarMenu.getItem(1));
    await checkPopupsVisibility({ isPageViewerVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();

    //click on toolbar filter button
    //Check that only PageViewer popup is visible
    await t.click(toolbarMenu.getItem(4));
    await checkPopupsVisibility({ isFilterPopupVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();
});

test('Test View change', async t => {
    //Check GridView is visible
    await t
        .expect(mainGrid.el.visible).ok()
        .expect(cardViewGrid.el.visibile).notOk()
        .expect(toolbarMenu.isItemChecked(2)).ok()
        .expect(toolbarMenu.isItemChecked(3)).notOk()

        //change view to CardView
        .click(toolbarMenu.getItem(3))

        //Check CardView is visible
        .expect(mainGrid.el.visible).notOk()
        .expect(cardViewGrid.el.visible).ok()
        .expect(toolbarMenu.isItemChecked(2)).notOk()
        .expect(toolbarMenu.isItemChecked(3)).ok();
});

test('Test search', async t => {
    //Type text in search input
    await t
        .typeText(getEditInput('SearchBox'), 'a')

        //Check matching text is highlighted
        .expect(mainGrid.getSearchMatch(1).exists).ok('', { timeout: 50000 });
});

test('Test Edit Task', async t => {
    //Click on first tasks grid edit button
    await t
        .click(mainGrid.customButtons.withText('Edit'))

        //Type new Subject in edit popup
        .typeText(getEditInput('TaskSubjectTextBox'), 'TestSubject', { replace: true })

        //Type new Details in edit popup
        .typeText(getEditInput('DetailsMemo'), 'TestDetails', { replace: true })

        //Click on popup Save button
        .click(Selector('#TaskSaveButton'));

    // NOTE: demo content can't be changed
    //Check that the editing operation is successful
    /* await t
     .expect(mainGrid.getDataRow(0).textContent).contains('TestSubject')
     .expect(mainGrid.previewRows.nth(0).textContent).contains('TestDetails');*/
});

test('Test search in CardView mode', async t => {
    //Change view to CardView
    await t
        .click(toolbarMenu.getItem(3))

        //Type text in search input
        .typeText(getEditInput('SearchBox'), 'a')

        //Check matching text is highlighted
        .expect(cardViewGrid.searchMatch.exists).ok('', { timeout: 50000 });
});

test('Test Edit Task in CardView mode', async t => {
    //Change view to CardView
    await t
        .click(toolbarMenu.getItem(3))

        //Click on first tasks grid edit button
        .click(cardViewGrid.el.find("[id*='EditButton']").nth(0))

        //Type new Subject in edit popup
        .typeText(getEditInput('TaskSubjectTextBox'), 'CVTestSubject', { replace: true })

        //Click on popup Save button
        .click(Selector('#TaskSaveButton'));

    // NOTE: demo content can't be changed
    //Check that the editing operation is successful
    //await t.expect(cardViewGrid.el.textContent).contains('CVTestSubject');
});

test('Test Filter', async t => {
    const initRowContent = mainGrid.getDataRow(2).textContent;

    //Check filter navbar items checked state
    await t
        .expect(navBar.getItem(0, 0).getAttribute('class')).contains('Selected')
        .expect(navBar.getItem(0, 1).getAttribute('class')).notContains('Selected')

        //click on the second filter
        .click(navBar.getItem(0, 1))

        //Check the data grid content and check filter navbar items checked state
        .expect(mainGrid.getDataRow(2).textContent).notEql(initRowContent)
        .expect(navBar.getItem(0, 0).getAttribute('class')).notContains('Selected')
        .expect(navBar.getItem(0, 1).getAttribute('class')).contains('Selected');
});

test('Test Filter in CardView mode', async t => {
    //Change view to CardView
    await t.click(toolbarMenu.getItem(3));

    const employeeName = cardViewGrid.cards.nth(0).textContent;

    //Check filter navbar items checked state
    await t
        .expect(navBar.getItem(0, 0).getAttribute('class')).contains('Selected')
        .expect(navBar.getItem(0, 1).getAttribute('class')).notContains('Selected')

        // click on the third filter
        .click(navBar.getItem(0, 1))

        //Check the card content and check filter navbar items checked state
        .expect(cardViewGrid.cards.nth(0).textContent).notEql(employeeName)
        .expect(navBar.getItem(0, 0).getAttribute('class')).notContains('Selected')
        .expect(navBar.getItem(0, 1).getAttribute('class')).contains('Selected');
});
