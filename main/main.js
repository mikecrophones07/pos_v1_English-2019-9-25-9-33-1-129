'use strict';


//TODO: Implement the exercise requirements in this file and remove this comment
'use strict';

function printReceipt(tags){
    let items = decodeTags(tags);
    let receipt = calculateReceipt(items);
    console.log(renderReceipt(receipt));
};

function renderReceipt(receipt){
    let renderedReceipt = '***<store earning no money>Receipt ***\n';
    receipt[0].receiptItems.forEach(item => {
        renderedReceipt += 'Name：'+ item.name +'，Quantity：' + item.count + ' ' + item.unit + '，Unit：' + item.price.toFixed(2) + '(yuan)，Subtotal：' + item.subTotal.toFixed(2) + '(yuan)\n';
    });
    renderedReceipt += '----------------------\n' 
                + 'Total：' + receipt[0].total.toFixed(2) +'(yuan)\n'
                + 'Discounted prices：' + receipt[0].savings.toFixed(2) + '(yuan)\n'
                + '**********************';
    return renderedReceipt;
}

function decodeTags(tags){
    return combinedItems(decodeBarcodes(tags));
}

function combinedItems(decodeBarcodes){
    let itemInfo = loadItems(decodeBarcodes);
    return decodeBarcodes.map(barcode => {
        let item = itemInfo.filter(item => item.barcode === barcode.barcode)[0];
        if(barcode.count > 1){
            item.unit += 's';
        }
        item.count = barcode.count;
        return item;
    });
}

function loadItems(decodeBarcodes){
    return decodeBarcodes.map(barcode => 
        loadAllItems().filter(items=> items.barcode === barcode.barcode)[0]
    );
}

function decodeBarcodes(tags){
    let realTags = tags.map(value => value.split('-', 1)[0]);
    let uniqueBarcodes = [...new Set(realTags)].map(value => {
        let count = tags.map(tag => {
            let decodeTag = tag.split('-', 2);
            if(value === decodeTag[0]){
                if(decodeTag[1] !== undefined && isFloat(parseFloat(decodeTag[1]))){
                    return parseFloat(decodeTag[1]);
                }
                else if(decodeTag[1] !== undefined && !isFloat(parseFloat(decodeTag[1]))){
                    return parseInt(decodeTag[1]);
                }
                return 1;
            }
            return 0;
        }).reduce((prev, next) => prev + next);

        return {
                barcode: value,
                count: count
            }
    });
    return uniqueBarcodes;
    // return null;
}

function isFloat(number){
    return Number(number) === number && number % 1 !== 0;
}

function calculateReceipt(items){
    return [{
        receiptItems : calculateReceiptItems(items),
        total : calculateReceiptTotal(items),
        savings : calculateReceiptSavings(items)
    }];
}

function calculateReceiptSavings(items){
    return calculateReceiptItems(items).map(item => (item.count * item.price) - item.subTotal).reduce((total, item) => item + total);
}

function calculateReceiptTotal(items){
    return calculateReceiptItems(items).map(item => item.subTotal).reduce((total, item) => item + total);
}

function calculateReceiptItems(items){
    return promoteReceiptItems(items, loadAllPromotion());

}

function loadAllPromotion(){
    return loadPromotions()
}

function promoteReceiptItems(items, promotions){
    return items.map(item => {
        const hasPromotion = promotions[0].barcodes.filter(value => value === item.barcode)[0];
        if(hasPromotion === undefined){
            item.subTotal = item.count * item.price;
            return item;
        }
        item.subTotal = (item.count-1) * item.price;
        return item;
    })
}


module.exports = {
    decodeBarcodes:decodeBarcodes,
    loadItems:loadItems,
    combinedItems:combinedItems,
    decodeTags:decodeTags,
    loadAllPromotion:loadAllPromotion,
    promoteReceiptItems:promoteReceiptItems,
    calculateReceiptItems:calculateReceiptItems,
    calculateReceiptTotal:calculateReceiptTotal,
    calculateReceiptSavings:calculateReceiptSavings,
    calculateReceipt:calculateReceipt,
    renderReceipt:renderReceipt,
    printReceipt:printReceipt
}
