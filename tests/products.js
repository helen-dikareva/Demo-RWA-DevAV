import { Selector } from 'testcafe';
import { Grid, Popup, getEditInput, navBar, toolbarMenu, ImageSlider } from '../page-model';
import { checkPopupsVisibility } from '../helpers';

fixture('Products')
    .page('https://demos.devexpress.com/RWA/DevAV/Products.aspx');

const grid = new Grid('ProductGrid');

test('Test GridView selection change', async t => {
    const detailsPanelProductName = Selector('#DetailsHeaderLabel');
    const productName             = await detailsPanelProductName.textContent;

    const row = await grid.getDataRow(1);

    // Click on the second grid row
    await t
        .click(row)

        // Check details content is changed
        .expect(detailsPanelProductName.textContent).notEql(productName);
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

    // click on toolbar document viewer button
    //Check that only PageViewer popup is visible
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

    //click on toolbar Filter button
    //Check that only Filter popup is visible
    await t.click(toolbarMenu.getItem(5));
    await checkPopupsVisibility({ isFilterPopupVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();

    //click on toolbar new button
    //Check that only EditMessage popup is visible
    await t.click(toolbarMenu.getItem(0));
    await checkPopupsVisibility({ isEditMessagePopupVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();
});

test('Test search', async t => {
    //Type text in search input
    await t
        .typeText(getEditInput('SearchBox'), 'a')

        //Check matching text is highlighted
        .expect(grid.getSearchMatch(0).exists).ok('', { timeout: 50000 })

        //Sort column by clicking on the header
        .click(grid.columnHeader.withText('Cost'))

        //Check matching text is highlighted
        .expect(grid.getSearchMatch(0).exists).ok('', { timeout: 50000 });
});

test('Test Filter', async t => {
    const initRowContent = grid.getDataRow(0).textContent;

    //Check filter navbar items checked state
    await t
        .expect(navBar.getItem(0, 0).getAttribute('class')).contains('Selected')
        .expect(navBar.getItem(0, 2).getAttribute('class')).notContains('Selected')

        //click on the second filter
        .click(navBar.getItem(0, 2))

        //Check the data grid content and check filter navbar items checked state
        .expect(grid.getDataRow(0).textContent).notEql(initRowContent)
        .expect(navBar.getItem(0, 0).getAttribute('class')).notContains('Selected')
        .expect(navBar.getItem(0, 2).getAttribute('class')).contains('Selected');
});

test('Test PopupImageSlider', async t => {
    const productPopup = new Popup('Product');
    const imageSlider  = new ImageSlider('ProductImageSlider');

    //Check popup image slider visibility
    await t
        .expect(productPopup.el.visible).notOk('ProductPopup is hidden')

        //click on main image slider item
        .click(imageSlider.items.nth(0))

        //Check that ProductPopup is shown
        .expect(productPopup.el.visible).ok();
});
