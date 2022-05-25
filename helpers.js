import { t } from 'testcafe';
import { Popup } from './page-model';

const pageViewerPopup      = new Popup('PageViewer');
const filterPopup          = new Popup('Filter');
const editMessagePopup     = new Popup('EditMessage');
const revenueAnalysisPopup = new Popup('RevenueAnalysis');

const ALL_POPUP_HIDDEN = {
    isPageViewerVisible:           false,
    isFilterPopupVisible:          false,
    isEditMessagePopupVisible:     false,
    isRevenueAnalysisPopupVisible: false
};

export async function checkPopupsVisibility ({ isPageViewerVisible = false, isFilterPopupVisible = false, isEditMessagePopupVisible = false, isRevenueAnalysisPopupVisible = false } = ALL_POPUP_HIDDEN) {
    await t
        .expect(pageViewerPopup.el.visible).eql(isPageViewerVisible)
        .expect(filterPopup.el.visible).eql(isFilterPopupVisible)
        .expect(editMessagePopup.el.with({ timeout: isEditMessagePopupVisible ? void 0 : 0 }).visible).eql(isEditMessagePopupVisible)
        .expect(revenueAnalysisPopup.el.with({ timeout: isRevenueAnalysisPopupVisible ? void 0 : 0 }).visible).eql(isRevenueAnalysisPopupVisible);
}
