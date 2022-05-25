import { navBar, toolbarMenu, DockPanel, pivotGrid } from '../page-model';
import { checkPopupsVisibility } from '../helpers';

fixture('Dashboard')
    .page('https://demos.devexpress.com/RWA/DevAV/Dashboard.aspx');

const revenueAnalysisPanel    = new DockPanel('PivotGridPanel');
const revenueSnapshotPanel    = new DockPanel('RevenueChartPanel');
const opportunitiesChartPanel = new DockPanel('OpportunitiesChartPanel');

test('Test Popups Visibility', async t => {
    //Check that no popup is not visible
    await checkPopupsVisibility();

    //click on toolbar document viewer button
    //Check that only PageViewer popup is visible
    await t.click(toolbarMenu.getItem(0));
    await checkPopupsVisibility({ isPageViewerVisible: true });

    //Reset state
    await t.pressKey('esc');
    await checkPopupsVisibility();

    //click on toolbar spreadsheet button
    //Check that only PageViewer popup is visible
    await t.click(toolbarMenu.getItem(1));
    await checkPopupsVisibility({ isPageViewerVisible: true });

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
});

test('Test open & close dock panels', async t => {
    //Check all dock panels visibility
    await t
        .expect(toolbarMenu.isItemChecked(2)).ok('PivotGrid toolbar item is checked')
        .expect(revenueAnalysisPanel.el.visible).ok('PivotGrid dock panel is visible')

        .expect(toolbarMenu.isItemChecked(3)).ok('Revenue toolbar item is checked')
        .expect(revenueSnapshotPanel.el.visible).ok('Revenue dock panel is visible')

        .expect(toolbarMenu.isItemChecked(4)).ok('Opportunities toolbar item is checked')
        .expect(opportunitiesChartPanel.el.visible).ok('Opportunities dock panel is visible')

        //click on PivotGrid dock panel close button
        .click(revenueAnalysisPanel.closeButton)

        //Check that PivotGrid dock panel is hidden
        .expect(toolbarMenu.isItemChecked(2)).notOk('PivotGrid toolbar item is not checked')
        .expect(revenueAnalysisPanel.el.visible).notOk('PivotGrid dock panel is not visible')

        //click on RevenueChart dock panel close button
        .click(revenueSnapshotPanel.closeButton)

        //Check that RevenueChart dock panel is hidden
        .expect(toolbarMenu.isItemChecked(3)).notOk('Revenue toolbar item is not checked')
        .expect(revenueSnapshotPanel.el.visible).notOk('Revenue dock panel is not visible')

        //click on Revenue dock panel toolbar button
        .click(toolbarMenu.getItem(3))

        //Check that RevenueChart dock panel is visible
        .expect(toolbarMenu.isItemChecked(3)).ok('Revenue toolbar item is checked')
        .expect(revenueSnapshotPanel.el.visible).ok('Revenue dock panel is visible')

        //click on OpportunitiesChart dock panel close button
        .click(opportunitiesChartPanel.closeButton)

        //Check that OpportunitiesChart dock panel is hidden
        .expect(toolbarMenu.isItemChecked(4)).notOk('Opportunities toolbar item is not checked')
        .expect(opportunitiesChartPanel.el.visible).notOk('Opportunities dock panel is not visible')

        //click on OpportunitiesChart dock panel toolbar button
        .click(toolbarMenu.getItem(4))

        //Check that OpportunitiesChart dock panel is visible
        .expect(toolbarMenu.isItemChecked(4)).ok('Opportunities toolbar item is checked')
        .expect(opportunitiesChartPanel.el.visible).ok('Opportunities dock panel is visible');
});

test('Test dragging', async t => {
    //Save initial revenueAnalysis's widths
    const initialTopPanelWidth = await revenueAnalysisPanel.el.offsetWidth;
    const initialCellWidth     = await pivotGrid.getDataCell(0, 0).offsetWidth;

    //Check all dock panels position
    let revenueAnalysisRect    = await revenueAnalysisPanel.el.boundingClientRect;
    let revenueSnapshotRect    = await revenueSnapshotPanel.el.boundingClientRect;
    let opportunitiesChartRect = await opportunitiesChartPanel.el.boundingClientRect;

    await t
        .expect(revenueAnalysisRect.bottom).lt(revenueSnapshotRect.top, 'RevenueAnalysis dock panel is higher than RevenueSnapshot dock panel')
        .expect(revenueAnalysisRect.bottom).lt(opportunitiesChartRect.top, 'RevenueAnalysis dock panel is higher than Opportunities dock panel')
        .expect(revenueSnapshotRect.top).eql(opportunitiesChartRect.top, 'Opportunities dock panel and RevenueSnapshot dock panel have the same Y position')
        .expect(revenueAnalysisRect.left).eql(revenueSnapshotRect.left, 'RevenueAnalysis dock panel and RevenueSnapshot dock panel have the same X position')
        .expect(revenueSnapshotRect.right).lt(opportunitiesChartRect.left, 'RevenueSnapshot dock panel is lefter than Opportunities dock panel');

    //drag RevenueSnapshot dock panel to top dock zone and wait for animation ends
    await t
        .dragToElement(revenueSnapshotPanel.header, revenueAnalysisPanel.header)
        .expect(revenueSnapshotPanel.el.offsetWidth).eql(initialTopPanelWidth)

        //Check that current revenueAnalysis's cell width is less that initial
        .expect(pivotGrid.getDataCell(0, 0).offsetWidth).lt(initialCellWidth);

    //Check all dock panels position
    revenueAnalysisRect    = await revenueAnalysisPanel.el.boundingClientRect;
    revenueSnapshotRect    = await revenueSnapshotPanel.el.boundingClientRect;
    opportunitiesChartRect = await opportunitiesChartPanel.el.boundingClientRect;

    await t
        .expect(revenueAnalysisRect.top).gt(revenueSnapshotRect.bottom, 'RevenueSnapshot dock panel is higher than RevenueAnalysis dock panel')
        .expect(revenueAnalysisRect.top).eql(opportunitiesChartRect.top, 'RevenueAnalysis dock panel and Opportunities dock panel have the same Y position')
        .expect(revenueSnapshotRect.bottom).lt(opportunitiesChartRect.top, 'RevenueSnapshot dock panel  is higher than Opportunities dock panel')
        .expect(revenueAnalysisRect.left).eql(revenueSnapshotRect.left, 'RevenueAnalysis dock panel and RevenueSnapshot dock panel have the same X position')
        .expect(revenueAnalysisRect.right).lt(opportunitiesChartRect.left, 'RevenueAnalysis dock panel is lefter than Opportunities dock panel');

    const initialOpportunitiesPanelWidth = await opportunitiesChartPanel.el.offsetWidth;

    //Drag Revenue dock panel to right dock zone and wait for animation ends
    await t
        .dragToElement(revenueSnapshotPanel.header, opportunitiesChartPanel.header)
        .expect(revenueSnapshotPanel.el.offsetWidth).eql(initialOpportunitiesPanelWidth);

    //Check all dock panels position
    revenueAnalysisRect    = await revenueAnalysisPanel.el.boundingClientRect;
    revenueSnapshotRect    = await revenueSnapshotPanel.el.boundingClientRect;
    opportunitiesChartRect = await opportunitiesChartPanel.el.boundingClientRect;

    await t
        .expect(revenueAnalysisRect.top).eql(revenueSnapshotRect.top, 'RevenueAnalysis dock panel and RevenueSnapshot dock panel have the same Y position')
        .expect(revenueAnalysisRect.top).gt(opportunitiesChartRect.bottom, 'Opportunities dock panel is higher than RevenueAnalysis dock panel')
        .expect(revenueSnapshotRect.top).gt(opportunitiesChartRect.bottom, 'Opportunities dock panel is higher than RevenueSnapshot dock panel')
        .expect(revenueAnalysisRect.right).lt(revenueSnapshotRect.left, 'RevenueAnalysis dock panel is lefter than RevenueSnapshot dock panel')
        .expect(revenueAnalysisRect.left).eql(opportunitiesChartRect.left, 'RevenueSnapshot dock panel and Opportunities dock panel have the same X position');
});

test('Test Filter', async t => {
    const initialCellValue = await pivotGrid.getDataCell(0, 0).textContent;

    //Check filter navbar items checked state
    await t
        .expect(navBar.getItem(0, 0).getAttribute('class')).contains('Selected')
        .expect(navBar.getItem(0, 1).getAttribute('class')).notContains('Selected')

        //click on the second filter
        .click(navBar.getItem(0, 1))

        //check that cell value is different
        .expect(pivotGrid.getDataCell(0, 0).textContent).notEql(initialCellValue)

        //Check filter navbar items checked state
        .expect(navBar.getItem(0, 0).getAttribute('class')).notContains('Selected')
        .expect(navBar.getItem(0, 1).getAttribute('class')).contains('Selected');
});
