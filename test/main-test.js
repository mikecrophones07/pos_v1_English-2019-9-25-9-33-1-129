'use strict';

describe('pos', () => {

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

  it('should return decodedBarcodes when input tags', () => {
      const tags = ['ITEM000001',
                    'ITEM000001',
                    'ITEM000001',
                    'ITEM000001',
                    'ITEM000001',
                    'ITEM000003-2',
                    'ITEM000005',
                    'ITEM000005',
                    'ITEM000005'];
      const result = decodeBarcodes(tags);
      const expectedResult = [
                  { barcode : 'ITEM000001',
                    count : 5},
                  { barcode : 'ITEM000003',
                    count : 2},
                  { barcode : 'ITEM000005',
                    count : 3}];
      expect(result).toEqual(expectedResult);
  })

  it('should load all items when input decoded barcodes', () => {
    const decodedBarcodes = [{ 
                              barcode : 'ITEM000001',
                              count : 5 
                            },
                            { 
                              barcode : 'ITEM000003',
                              count : 2
                            },
                            { 
                              barcode : 'ITEM000005',
                              count : 3
                            }];
    const result = loadItems(decodedBarcodes);
    const expectedResult = [{
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
                            }];
    expect(result).toEqual(expectedResult);
  })
  
  it('should return item info and counts when combine items', () => {
    const decodedBarcodes = [{ 
                              barcode : 'ITEM000001',
                              count : 5 
                            },
                            { 
                              barcode : 'ITEM000003',
                              count : 2
                            },
                            { 
                              barcode : 'ITEM000005',
                              count : 3
                            }];
    const result = combinedItems(decodedBarcodes);
    const expectedResult = [{
                              barcode: 'ITEM000001',
                              name: 'Sprite',
                              unit: 'bottles',
                              price: 3.00,
                              count: 5
                            },
                            {
                              barcode: 'ITEM000003',
                              name: 'Litchi',
                              unit: 'pounds',
                              price: 15.00,
                              count : 2
                            },
                            {
                              barcode: 'ITEM000005',
                              name: 'Instant Noodles',
                              unit: 'bags',
                              price: 4.50,
                              count : 3
                            }];
    expect(result).toEqual(expectedResult);
  })
  
  it('should return items when given tags', () => {
    const tags = ['ITEM000001',
                  'ITEM000001',
                  'ITEM000001',
                  'ITEM000001',
                  'ITEM000001',
                  'ITEM000003-2',
                  'ITEM000005',
                  'ITEM000005',
                  'ITEM000005'];
    const result = decodeTags(tags);
    const expectedResult = [{
                            barcode: 'ITEM000001',
                            name: 'Sprite',
                            unit: 'bottles',
                            price: 3.00,
                            count: 5
                          },
                          {
                            barcode: 'ITEM000003',
                            name: 'Litchi',
                            unit: 'pounds',
                            price: 15.00,
                            count : 2
                          },
                          {
                            barcode: 'ITEM000005',
                            name: 'Instant Noodles',
                            unit: 'bags',
                            price: 4.50,
                            count : 3
                          }];
    expect(result).toEqual(expectedResult);
  })
  
  it('should load all promotions', () => {
    const result = loadAllPromotion();
    const expectedResult = [{
                            type: 'BUY_TWO_GET_ONE_FREE',
                            barcodes: [
                                      'ITEM000000',
                                      'ITEM000001',
                                      'ITEM000005'
                                      ]
                            }];
    expect(result).toEqual(expectedResult);
  })
  
  it('should return items with applied promotions', () => {
    const items = [{
                    barcode: 'ITEM000001',
                    name: 'Sprite',
                    unit: 'bottles',
                    price: 3.00,
                    count: 5
                  },
                  {
                    barcode: 'ITEM000003',
                    name: 'Litchi',
                    unit: 'pounds',
                    price: 15.00,
                    count : 2
                  },
                  {
                    barcode: 'ITEM000005',
                    name: 'Instant Noodles',
                    unit: 'bags',
                    price: 4.50,
                    count : 3
                  }];
    const promotions = [{
                    type: 'BUY_TWO_GET_ONE_FREE',
                    barcodes: [
                              'ITEM000000',
                              'ITEM000001',
                              'ITEM000005'
                              ]
                    }];
    const result = promoteReceiptItems(items, promotions);
    const expectedResult = [{
                              barcode: 'ITEM000001',
                              name: 'Sprite',
                              unit: 'bottles',
                              price: 3.00,
                              count: 5,
                              subTotal: 12.00
                            },
                            {
                              barcode: 'ITEM000003',
                              name: 'Litchi',
                              unit: 'pounds',
                              price: 15.00,
                              count : 2,
                              subTotal: 30.00
                            },
                            {
                              barcode: 'ITEM000005',
                              name: 'Instant Noodles',
                              unit: 'bags',
                              price: 4.50,
                              count : 3,
                              subTotal: 9.00
                            }];
    expect(result).toEqual(expectedResult);
  })
  
  it('should return items with applied promotions', () => {
    const items = [{
                    barcode: 'ITEM000001',
                    name: 'Sprite',
                    unit: 'bottles',
                    price: 3.00,
                    count: 5
                  },
                  {
                    barcode: 'ITEM000003',
                    name: 'Litchi',
                    unit: 'pounds',
                    price: 15.00,
                    count : 2
                  }];
    const result = calculateReceiptItems(items);
    const expectedResult = [{
                              barcode: 'ITEM000001',
                              name: 'Sprite',
                              unit: 'bottles',
                              price: 3.00,
                              count: 5,
                              subTotal: 12.00
                            },
                            {
                              barcode: 'ITEM000003',
                              name: 'Litchi',
                              unit: 'pounds',
                              price: 15.00,
                              count : 2,
                              subTotal: 30.00
                            }];
    expect(result).toEqual(expectedResult);
  })
  
  it('should calculate Total of all items', () => {
    const receiptItems = [{
                    barcode: 'ITEM000001',
                    name: 'Sprite',
                    unit: 'bottles',
                    price: 3.00,
                    count: 5,
                    subTotal: 12.00
                  },
                  {
                    barcode: 'ITEM000003',
                    name: 'Litchi',
                    unit: 'pounds',
                    price: 15.00,
                    count : 2,
                    subTotal: 30.00
                  },
                  {
                    barcode: 'ITEM000005',
                    name: 'Instant Noodles',
                    unit: 'bags',
                    price: 4.50,
                    count : 3,
                    subTotal: 9.00
                  }];
    const result = calculateReceiptTotal(receiptItems);
    const expectedResult = 51;
    expect(result).toBe(expectedResult);
  })
  
  it('should calculate total savings of all items', () => {
    const items = [{
                    barcode: 'ITEM000001',
                    name: 'Sprite',
                    unit: 'bottles',
                    price: 3.00,
                    count: 5,
                    subTotal: 12.00
                  },
                  {
                    barcode: 'ITEM000003',
                    name: 'Litchi',
                    unit: 'pounds',
                    price: 15.00,
                    count : 2,
                    subTotal: 30.00
                  },
                  {
                    barcode: 'ITEM000005',
                    name: 'Instant Noodles',
                    unit: 'bags',
                    price: 4.50,
                    count : 3,
                    subTotal: 9.00
                  }];
    const result = calculateReceiptSavings(items);
    const expectedResult = 7.50;
    expect(result).toBe(expectedResult);
  })
  
  it('should return receipt with total price and savings', () => {
    const items = [{
                    barcode: 'ITEM000001',
                    name: 'Sprite',
                    unit: 'bottles',
                    price: 3.00,
                    count: 5,
                    subTotal: 12.00
                  },
                  {
                    barcode: 'ITEM000003',
                    name: 'Litchi',
                    unit: 'pounds',
                    price: 15.00,
                    count : 2,
                    subTotal: 30.00
                  },
                  {
                    barcode: 'ITEM000005',
                    name: 'Instant Noodles',
                    unit: 'bags',
                    price: 4.50,
                    count : 3,
                    subTotal: 9.00
                  }];
    const result = calculateReceipt(items);
    const expectedResult = [{
                              receiptItems : items,
                              total : 51.00,
                              savings : 7.50
                            }];
    expect(result).toEqual(expectedResult);
  })
  
  it('should return rendered receipt to String given receipt array', () => {
    const receipt = [{receiptItems: [{
                    barcode: 'ITEM000001',
                    name: 'Sprite',
                    unit: 'bottles',
                    price: 3.00,
                    count: 5,
                    subTotal: 12.00
                  },
                  {
                    barcode: 'ITEM000003',
                    name: 'Litchi',
                    unit: 'pounds',
                    price: 15.00,
                    count : 2,
                    subTotal: 30.00
                  },
                  {
                    barcode: 'ITEM000005',
                    name: 'Instant Noodles',
                    unit: 'bags',
                    price: 4.50,
                    count : 3,
                    subTotal: 9.00
                  }],
                  total : 51.00,
                  savings : 7.50
                }];
    const result = renderReceipt(receipt);
    const expectedResult = `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2 pounds，Unit：15.00(yuan)，Subtotal：30.00(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：51.00(yuan)
Discounted prices：7.50(yuan)
**********************`;
    expect(result).toBe(expectedResult);
  })
});