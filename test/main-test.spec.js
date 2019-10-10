'use strict';

const main = require('../main/main');

describe('pos', () => {
  const tags = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2.5',
    'ITEM000005',
    'ITEM000005-2',
  ];

  it('should return true when barcode is decoded', () => {
    let expected = [
      { barcode: 'ITEM000001', count: 5 },
      { barcode: 'ITEM000003-2.5', count: 1 },
      { barcode: 'ITEM000005', count: 1 },
      { barcode: 'ITEM000005-2', count: 1 }
    ];
    expect(decodeBarcode(tags)).toMatchObject(expected);
  });

  it('should return item info when given distinct Barcodes', () => {
    const distinctTags = [
      'ITEM000001',
      'ITEM000003',
      'ITEM000005',
    ];
    let expected = [{
      barcode: 'ITEM000001',
      name: 'Sprite',
      unit: 'bottle',
      price: 3.00
    },
    {
      barcode: 'ITEM000003',
      name: 'Litchi',
      unit: 'pound',
      price: 15.00
    },
    {
      barcode: 'ITEM000005',
      name: 'Instant Noodles',
      unit: 'bag',
      price: 4.50
    }]
    expect(loadItems(distinctTags)).toMatchObject(expected);
  });

  it('should return combined items info when given distinct item info', () => {
    const distinctDecodedBarcode = [
      { barcode: 'ITEM000001', count: 5 },
      { barcode: 'ITEM000003-2.5', count: 1 },
      { barcode: 'ITEM000005', count: 1 },
      { barcode: 'ITEM000005-2', count: 1 }
    ];

    const distinctItemInfo = [
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00 },
      { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50}
    ];

    let expected = [
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5 },
      { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3 }
    ];

    expect(combinedItems(distinctDecodedBarcode, distinctItemInfo)).toMatchObject(expected);
  });

  it('should return final Items info when given barcodes', () => {
    let expected = [
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5 },
      { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3 }
    ];

    expect(decodeTags(tags)).toMatchObject(expected);
  });

  it('should return all Promotions', () => {
    expect(loadAllPromotion(tags)).to.not.be.empty();
  });

  it('should return receipt items when promotion list is loaded', () => {
    let promotions = loadAllPromotion(tags);
    let items = [
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5 },
      { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3 }
    ];

    let expected = [
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5, subtotal: 12.00 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5, subtotal:37.50 },
      { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3, subtotal:9.00 }
    ]
    expect(calculateReceiptWithPromotions(items, promotions)).toMatchObject(expected);
  });

  it('should return total calculated Receipt Items with Promotion', () => {
    let items = [
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5 },
      { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3 }
    ];

    let expected = [{
      receiptItems: [
        { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5, subtotal: 12.00 },
        { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5, subtotal: 37.50 },
        { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3, subtotal: 9.00 }
      ],
      total: 58.50
    }
        
    ]
    expect(calculateReceipt(items)).toMatchObject(expected);
  });

  it('should return total calculated Savings', () => {
    let items = [
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5 },
      { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3 }
    ];

    let expected = 7.50;
    expect(calculateSavings(items)).toMatchObject(expected);
  });

  it('should return total calculated Receipt', () => {
    let items = [
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5 },
      { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3 }
    ];

    let expected = [{
      receiptItems: [
        { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5, subtotal: 12.00 },
        { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5, subtotal: 37.50 },
        { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3, subtotal: 9.00 }
      ],
      total: 58.50,
      savings: 7.50
    }]
    expect(calculateTotalReceipt(items)).toMatchObject(expected);
  });

  it('should return String receipt when render', () => {
    let receipt = [{
      receiptItems: [
        { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5, subtotal: 12.00 },
        { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 2.5, subtotal: 37.50 },
        { barcode: 'ITEM000005', name: 'Instant Noodles', unit: 'bag', price: 4.50, count: 3, subtotal: 9.00 }
      ],
      total: 58.50,
      savings: 7.50
    }];

    const expectText = `***<store earning no money>Receipt ***
    Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
    Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
    Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
    ----------------------
    Total：58.50(yuan)
    Discounted prices：7.50(yuan)
    **********************`;

    expect(renderReciept(receipt)).toMatchObject(expectText);
  });

    it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<store earning no money>Receipt ***
    Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
    Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
    Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
    ----------------------
    Total：58.50(yuan)
    Discounted prices：7.50(yuan)
    **********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });

});
