import { Selector } from 'testcafe';
import { Grid, getEditInput, toolbarMenu, ImageSlider, Menu, navBar } from '../page-model';
import { checkPopupsVisibility } from '../helpers';

fixture('Customers')
    .page('https://demos.devexpress.com/RWA/DevAV/Customers.aspx');

const grid        = new Grid('CustomerGrid');
const imageSlider = new ImageSlider('ImageSlider');

test('Test GridView selection change', async t => {
    const imageSliderFirstItemName = await imageSlider.getItemName(0);

    // Click on the second grid row
    await t
        .click(grid.getDataRow(1))

        // Check details content is changed
        .expect(imageSlider.getItemName(0)).notEql(imageSliderFirstItemName);
});

test('Test grid customization window', async t => {
    // Check grid view customization window visibility
    await t
        .expect(toolbarMenu.isItemChecked(6)).notOk()
        .expect(grid.customizationPopup.visible).notOk()

        //click on CW toolbar item
        .click(toolbarMenu.getItem(6))

        // Check grid view customization window visibility
        .expect(toolbarMenu.isItemChecked(6)).ok()
        .expect(grid.customizationPopup.visible).ok()

        //click on CW toolbar item
        .click(toolbarMenu.getItem(6))

        .expect(toolbarMenu.isItemChecked(6)).notOk()
        .expect(grid.customizationPopup.visible).notOk()

        //click on CW toolbar item
        .click(toolbarMenu.getItem(6))

        // Check grid view customization window visibility
        .expect(toolbarMenu.isItemChecked(6)).ok()
        .expect(grid.customizationPopup.visible).ok()

        //click on CW close button
        .click(grid.customizationPopupCloseButton)

        //Check grid view customization window visibility
        .expect(toolbarMenu.isItemChecked(6)).notOk()
        .expect(grid.customizationPopup.visible).notOk();
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

    //click on toolbar revenue analysis button
    //Check that only RevenueAnalysis popup is visible
    await t.click(toolbarMenu.getItem(4));
    await checkPopupsVisibility({ isRevenueAnalysisPopupVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();

    //click on toolbar filter button
    //Check that only Filter popup is visible
    await t.click(toolbarMenu.getItem(5));
    await checkPopupsVisibility({ isFilterPopupVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();

    //click on toolbar New button
    //Check that only EditMessage popup is visible
    await t.click(toolbarMenu.getItem(0));
    await checkPopupsVisibility({ isEditMessagePopupVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();
});

test('Test customer employee editing', async t => {
    //Click on edit button
    await t
        .click(imageSlider.editButton)

        //Type new FirstName in edit popup
        .typeText(getEditInput('FirstNameTextBox'), 'TestFN', { replace: true })

        //Type new LastName in edit popup
        .typeText(getEditInput('LastNameTextBox'), 'TestLN', { replace: true })
        //Type new Position in edit popup
        .typeText(getEditInput('PositionTextBox'), 'TestPosition', { replace: true })

        //Click on popup Save button
        .click(Selector('#CustomerSaveButton'));

    // NOTE: demo content can't be changed
    /*await t
        .expect(imageSlider.items.nth(0).getDataRow(0).textContent).contains('TestFN')
        .expect(imageSlider.items.nth(0).getDataRow(0).textContent).contains('TestLN')
        .expect(imageSlider.items.nth(0).getDataRow(0).textContent).contains('TestPosition');*/
});

test('Test change image slider', async t => {
    const sliderMenu               = new Menu('SliderMenu');
    const imageSliderFirstItemName = await imageSlider.getItemName(0);

    //Check current image slider mode
    await t
        .expect(sliderMenu.getItem(0).innerText).contains('Contacts')

        //Change ImageSlider
        .click(sliderMenu.getItem(0))
        .click(sliderMenu.getItem([0, 0]))

        //Check image slider is changed
        .expect(imageSlider.getItemName(0)).notEql(imageSliderFirstItemName)
        .expect(sliderMenu.getItem(0).innerText).contains('Stores');
});

test('Test search', async t => {
    //Type text in search input
    await t
        .typeText(getEditInput('SearchBox'), 'a')

        //Check matching text is highlighted
        .expect(grid.getSearchMatch(0).exists).ok('', { timeout: 50000 })

        //Sort column by clicking on the header
        .click(grid.columnHeader.withText('City'))

        //Check matching text is highlighted
        .expect(grid.getSearchMatch(0).exists).ok('', { timeout: 50000 });
});

test('Test Filter', async t => {
    const initRowContent = grid.getDataRow(2).textContent;

    //Check filter navbar items checked state
    await t
        .expect(navBar.getItem(0, 0).getAttribute('class')).contains('Selected')
        .expect(navBar.getItem(0, 1).getAttribute('class')).notContains('Selected')

        //click on the second filter
        .click(navBar.getItem(0, 1))

        //Check the data grid content and check filter navbar items checked state
        .expect(grid.getDataRow(2).textContent).notEql(initRowContent)
        .expect(navBar.getItem(0, 0).getAttribute('class')).notContains('Selected')
        .expect(navBar.getItem(0, 1).getAttribute('class')).contains('Selected');
});
