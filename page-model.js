import { Selector } from 'testcafe';

class ToolbarMenu {
    constructor () {
        this.el    = Selector('#ToolbarMenu');
        this.items = this.el.find('li').withAttribute('id', new RegExp('ToolbarMenu_DXI' + '\\d+' + '_$'));
    }

    getItem (index) {
        return this.items.nth(index);
    }

    isItemChecked (index) {
        return this.getItem(index).hasClass('dxm-checked');
    }
}

class NavBar {
    constructor (controlId) {
        this.controlId = controlId;
        this.el        = Selector('#' + controlId);
    }

    getInnerElementByIdsParts (...args) {
        const itemCssSelector = `#${this.controlId}${args.join('')}`;

        return this.el.find(itemCssSelector);
    }

    getItem (groupIndex, itemIndex) {
        return this.getInnerElementByIdsParts('_I', groupIndex, 'i', itemIndex, '_');
    }
}

class PivotGrid {
    constructor () {
        this.el       = Selector('table').withAttribute('id', /_PivotGrid_PT$/);
        this.firstRow = this.el.find('td[class*=dxpgCell]').parent('tr');
    }

    getDataCell (rowIndex, columnIndex) {
        const row = rowIndex === 0 ?
                    this.firstRow :
                    this.firstRow.nextSibling('tr').nth(rowIndex - 1);

        return row.find('td[class*=dxpgCell]').nth(columnIndex);
    }
}

export class Grid {
    constructor (controlId) {
        this.controlId = controlId;
        this.el        = Selector('#' + controlId);
        this.rows      = this.el.find('tr').withAttribute('id', new RegExp(this.controlId + '_DXDataRow\\d+$'));

        this.detailedInfo         = Selector('#DetailsHeaderHeadLine > div');
        this.detailedInfoName     = this.detailedInfo.nth(0);
        this.detailedInfoPosition = this.detailedInfo.nth(1);

        this.customizationPopup            = this.el.find(`[id^="${this.controlId}_custwindow_PW-"]`);
        this.customizationPopupCloseButton = this.customizationPopup.find('.dxpc-closeBtn');

        this.customButtons = this.el.find(`[id^="${this.controlId}_DXCBtn"]`);
        this.previewRows   = this.el.find('tr').withAttribute('id', new RegExp(this.controlId + '_DXPRow\\d+$'));

        this.columnHeader = this.el.find('td').withAttribute('id', new RegExp(`${this.controlId}_col\\d+$`));
    }

    getDataRow (index) {
        return this.rows.nth(index);
    }

    getEditingButton (rowIndex) {
        return this.getDataRow(rowIndex).find('.gridEditButton');
    }

    getSearchMatch (rowIndex) {
        return this.rows.nth(rowIndex).find('em').withAttribute('class', 'dxgvHL');
    }
}

export class Popup {
    constructor (popupName) {
        this.el = Selector('div').withAttribute('id', new RegExp(`^${popupName}Popup_PWC?-\\d+$`));
    }

    getEditInput (inputName) {
        return this.el.find(`#${inputName}_I`);
    }
}

export class PageControl {
    constructor (controlId) {
        this.controlId = controlId;
        this.el        = Selector('#' + controlId);

        this.tabs = this.el.find('li').withAttribute('id', new RegExp(`${controlId}_A?T\\d+(?!\[^0-9])`)).filterVisible();
    }
}

export class CardView {
    constructor (controlId) {
        this.controlId   = controlId;
        this.el          = Selector('#' + controlId);
        this.editButton  = this.el.find("[id*='EditImage']");
        this.searchMatch = this.el.find('span.hgl');
        this.cards       = this.el.find('div').withAttribute('id', new RegExp(this.controlId + '_DXDataCard\\d+$'));
    }
}

export class DockPanel {
    constructor (controlId) {
        this.controlId   = controlId;
        this.el          = Selector('#' + controlId + '_PWC-1');
        this.header      = Selector('#' + controlId + '_PWH-1');
        this.closeButton = Selector('#' + controlId + '_HCB-1');
    }
}

export class ImageSlider {
    constructor (controlId) {
        this.controlId  = controlId;
        this.el         = Selector('#' + controlId);
        this.items      = this.el.find('.dxis-nbItem');
        this.editButton = this.items.find('img[id*=EditImage]');
    }

    getItemName (index) {
        return this.items.nth(index).find('span').textContent;
    }
}

export class Menu {
    constructor (controlId) {
        this.controlId = controlId;
        this.el        = Selector('#' + controlId);
    }

    getItem (indexes) {
        const indexPath = indexes.length ? indexes.join('i') : indexes;

        return Selector(`#${this.controlId}_DXI${indexPath}_`).filter('[id^= ' + this.controlId + ']');
    }
}

export function getEditInput (inputName) {
    return Selector(`#${inputName}_I`);
}

export const navBar = new NavBar('FilterNavBar');
export const toolbarMenu = new ToolbarMenu();
export const pivotGrid = new PivotGrid();
