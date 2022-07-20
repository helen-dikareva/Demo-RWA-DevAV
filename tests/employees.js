import { Selector } from 'testcafe';
import { Grid, Popup, CardView, PageControl, getEditInput, navBar, toolbarMenu } from '../page-model';
import { checkPopupsVisibility } from '../helpers';

fixture('Employees')
    .page('./Employees.aspx');

const mainGrid       = new Grid('EmployeesGrid');
const evaluationGrid = new Grid('EvaluationGrid');
const taskGrid       = new Grid('TasksGrid');

const cardViewGrid           = new CardView('EmployeeCardView');
const cardViewEvaluationGrid = new Grid('EvaluationGridView');
const cardViewTaskGrid       = new Grid('CVTasksGridView');

const detailedPageControl = new PageControl('DetailsPageControl');

test('Test GridView selection change', async t => {
    const row = await mainGrid.getDataRow(1);

    const initialName     = await mainGrid.detailedInfoName.textContent;
    const initialPosition = await mainGrid.detailedInfoPosition.textContent;

    // Click on the second grid row
    await t
        .click(row)

        // Check details content is changed
        .expect(mainGrid.detailedInfoName.textContent).notEql(initialName)
        .expect(mainGrid.detailedInfoPosition.textContent).notEql(initialPosition);
});

test('Test grid customization window', async t => {
    // Check grid view customization window visibility
    await t
        .expect(toolbarMenu.isItemChecked(9)).notOk()
        .expect(mainGrid.customizationPopup.visible).notOk()

        //click on CW toolbar item
        .click(toolbarMenu.getItem(9))

        // Check grid view customization window visibility
        .expect(toolbarMenu.isItemChecked(9)).ok()
        .expect(mainGrid.customizationPopup.visible).ok()

        //click on CW toolbar item
        .click(toolbarMenu.getItem(9))

        .expect(toolbarMenu.isItemChecked(9)).notOk()
        .expect(mainGrid.customizationPopup.visible).notOk()

        //click on CW toolbar item
        .click(toolbarMenu.getItem(9))

        // Check grid view customization window visibility
        .expect(toolbarMenu.isItemChecked(9)).ok()
        .expect(mainGrid.customizationPopup.visible).ok()

        //click on CW close button
        .click(mainGrid.customizationPopupCloseButton)

        //Check grid view customization window visibility
        .expect(toolbarMenu.isItemChecked(9)).notOk()
        .expect(mainGrid.customizationPopup.visible).notOk();
});

test('Test Popups Visibility', async t => {
    //Check that no popup is visible
    await checkPopupsVisibility();

    // Click on toolbar document viewer button
    // Check that only PageViewer popup is visible
    await t.click(toolbarMenu.getItem(2));
    await checkPopupsVisibility({ isPageViewerVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();

    //click on toolbar spreadsheet button
    //Check that only PageViewer popup is visible
    await t.click(toolbarMenu.getItem(3));
    await checkPopupsVisibility({ isPageViewerVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();

    //click on toolbar filter button
    //Check that only Filter popup is visible
    await t.click(toolbarMenu.getItem(8));
    await checkPopupsVisibility({ isFilterPopupVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();

    //click on toolbar meeting button
    //Check that only EditMessage popup is visible
    await t.click(toolbarMenu.getItem(4));
    await checkPopupsVisibility({ isEditMessagePopupVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();
});

test('Test View change', async t => {
    //Check GridView is visible
    await t
        .expect(mainGrid.el.visible).ok()
        .expect(cardViewGrid.el.visibile).notOk()
        .expect(toolbarMenu.isItemChecked(6)).ok()
        .expect(toolbarMenu.isItemChecked(7)).notOk()

        //change view to CardView
        .click(toolbarMenu.getItem(7))

        //Check CardView is visible
        .expect(mainGrid.el.visible).notOk()
        .expect(cardViewGrid.el.visible).ok()
        .expect(toolbarMenu.isItemChecked(6)).notOk()
        .expect(toolbarMenu.isItemChecked(7)).ok();
});

test('Test Edit Employee', async t => {
    const employeeEditPopup = new Popup('EmployeeEdit');

    //Click on first grid edit button
    await t
        .click(mainGrid.getEditingButton(0))

        //Type new FirstName in edit popup
        .typeText(employeeEditPopup.getEditInput('FirstNameTextBox'), 'TestFN', { replace: true })
        // Type new LastName in edit popup
        .typeText(employeeEditPopup.getEditInput('LastNameTextBox'), 'TestLN', { replace: true })
        //Type new Title in edit popup
        .typeText(employeeEditPopup.getEditInput('TitleTextBox'), 'TestTitle', { replace: true })

        //Click on popup Save button
        .click(Selector('#EmployeeSaveButton'));

    // NOTE: demo content can't be changed
    /*
     //Check that the editing operation is successful
     await t
     .expect(mainGrid.getDataRow(0).textContent).contains('TestFN')
     .expect(mainGrid.getDataRow(0).textContent).contains('TestLN')
     .expect(mainGrid.getDataRow(0).textContent).contains('TestTitle')

     .expect(mainGrid.detailedInfo.textContent).contains('TestFN')
     .expect(mainGrid.detailedInfo.textContent).contains('TestLN')
     .expect(mainGrid.detailedInfoPosition.textContent).contains('TestTitle');*/
});

test('Test search', async t => {
    //Type text in search input
    await t
        .typeText(getEditInput('SearchBox'), 'a')

        //Check matching text is highlighted
        .expect(mainGrid.getSearchMatch(0).exists).ok('', { timeout: 50000 });
});

test('Test Edit Evaluation', async t => {
    //Click on first evaluation grid edit button
    await t
        .click(evaluationGrid.customButtons.withText('Edit'))

        //Type new Subject in edit popup
        .typeText(getEditInput('EvaluationSubjectTextBox'), 'TestSubject', { replace: true })

        //Click on popup Save button
        .click(Selector('#EvaluationSaveButton'));

    // NOTE: demo content can't be changed
    //Check that the editing operation is successful
    //await t.expect(evaluationGrid.getDataRow(0).textContent).contains('TestSubject');
});

test('Test Edit Task', async t => {
    //Click on page control Tasks tab
    await t
        .click(detailedPageControl.tabs.nth(1))

        //Click on first tasks grid edit button
        .click(taskGrid.customButtons.withText('Edit'))

        //Type new Subject in edit popup
        .typeText(getEditInput('TaskSubjectTextBox'), 'TestSubject', { replace: true })

        //Click on popup Save button
        .click(Selector('#TaskSaveButton'));

    // NOTE: demo content can't be changed
    //Check that the editing operation is successful
    //await t.expect(taskGrid.getDataRow(0).textContent).contains('TestSubject');
});

test('Test Edit Employee in CardView mode', async t => {
    //Change view to CardView
    await t
        .click(toolbarMenu.getItem(7))

        //Click on first card edit button
        .click(cardViewGrid.editButton)

        //Type new FirstName in edit popup
        .typeText(getEditInput('FirstNameTextBox'), 'CVTestFN', { replace: true })

        //Type new LastName in edit popup
        .typeText(getEditInput('LastNameTextBox'), 'CVTestLN', { replace: true })

        //Click on popup Save button
        .click(Selector('#EmployeeSaveButton'));

    // NOTE: demo content can't be changed
    //Check that the editing operation is successful
    /*  await t
     .expect(cardViewGrid.el.textContent).contains('CVTestFN')
     .expect(cardViewGrid.el.textContent).contains('CVTestLN');*/
});

test('Test search in CardView mode', async t => {
    //Change view to CardView
    await t
        .click(toolbarMenu.getItem(7))

        //Type text in search input
        .typeText(getEditInput('SearchBox'), 'a')

        //Check matching text is highlighted
        .expect(cardViewGrid.searchMatch.exists).ok('', { timeout: 50000 });
});

test('Test Edit Evaluation in CardView mode', async t => {
    //Change view to CardView
    await t
        .click(toolbarMenu.getItem(7))

        //Click on first evaluation grid edit button
        .click(cardViewEvaluationGrid.customButtons.withText('Edit'))

        //Type new Subject in edit popup
        .typeText(getEditInput('EvaluationSubjectTextBox'), 'CVTestSubject', { replace: true })

        //Type new Evaluation in edit popup
        .typeText(getEditInput('EvaluationMemo'), 'CVTestEvaluation', { replace: true })

        //Click on popup Save button
        .click(Selector('#EvaluationSaveButton'));

    // NOTE: demo content can't be changed
    //Check that the editing operation is successful
    /*   await t
     .expect(cardViewEvaluationGrid.el.textContent).contains('CVTestSubject')
     .expect(cardViewEvaluationGrid.el.textContent).contains('CVTestEvaluation');*/
});

test('Test Edit Task in CardView mode', async t => {
    //Change view to CardView
    await t
        .click(toolbarMenu.getItem(7))

        //Click on page control Tasks tab
        .click(detailedPageControl.tabs.nth(1))

        //Click on first tasks grid edit button
        .click(cardViewTaskGrid.customButtons.withText('Edit'))

        //Type new Subject in edit popup
        .typeText(getEditInput('TaskSubjectTextBox'), 'CVTestSubject', { replace: true })

        //Type new Details in edit popup
        .typeText(getEditInput('DetailsMemo'), 'CVTestDetails', { replace: true })

        //Click on popup Save button
        .click(Selector('#TaskSaveButton'));

    // NOTE: demo content can't be changed
    //Check that the editing operation is successful
    /* await t
     .expect(cardViewTaskGrid.el.textContent).contains('CVTestSubject')
     .expect(cardViewTaskGrid.previewRows.nth(0).textContent).contains('CVTestDetails');*/
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
    await t.click(toolbarMenu.getItem(7));

    const employeeName = cardViewGrid.cards.nth(0).find('h5').textContent;

    //Check filter navbar items checked state
    await t
        .expect(navBar.getItem(0, 0).getAttribute('class')).contains('Selected')
        .expect(navBar.getItem(0, 2).getAttribute('class')).notContains('Selected')

        // click on the third filter
        .click(navBar.getItem(0, 2))

        //Check the card content and check filter navbar items checked state
        .expect(cardViewGrid.cards.nth(0).find('h5').textContent).notEql(employeeName)
        .expect(navBar.getItem(0, 0).getAttribute('class')).notContains('Selected')
        .expect(navBar.getItem(0, 2).getAttribute('class')).contains('Selected');
});
