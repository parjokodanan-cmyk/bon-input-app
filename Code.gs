function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(900)
    .setHeight(800);
}

// ===== SHEET OPERATIONS =====

function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create or get sheets
  let priceSheet = ss.getSheetByName('Price List');
  let bonSheet = ss.getSheetByName('Bon Data');
  
  // Create Price List sheet if not exists
  if (!priceSheet) {
    priceSheet = ss.insertSheet('Price List');
    priceSheet.appendRow(['Item', 'Harga']);
    // Default items
    priceSheet.appendRow(['BLD', 53000]);
    priceSheet.appendRow(['BLP', 0]);
    priceSheet.appendRow(['Paha atas', 0]);
    priceSheet.appendRow(['Paha', 0]);
    priceSheet.appendRow(['Sayap', 0]);
    priceSheet.appendRow(['Kepala', 0]);
    priceSheet.appendRow(['Kulit', 0]);
    priceSheet.appendRow(['Tulang', 0]);
    priceSheet.appendRow(['Ceker', 0]);
    priceSheet.appendRow(['Ati', 0]);
  }
  
  // Create Bon Data sheet if not exists
  if (!bonSheet) {
    bonSheet = ss.insertSheet('Bon Data');
    bonSheet.appendRow(['Nomor Bon', 'Tanggal', 'Pelanggan', 'Alamat', 'Items', 'Total']);
  }
  
  return true;
}

// Get price list from sheet
function getPriceList() {
  initializeSheet();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Price List');
  const data = sheet.getDataRange().getValues();
  
  const priceList = [];
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      priceList.push({
        name: data[i][0],
        price: data[i][1] || 0
      });
    }
  }
  
  return priceList;
}

// Save price list to sheet
function savePriceList(priceList) {
  initializeSheet();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Price List');
  
  // Clear existing data (keep header)
  sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).clearContent();
  
  // Add new data
  priceList.forEach((item, index) => {
    sheet.getRange(index + 2, 1, 1, 2).setValues([[item.name, item.price]]);
  });
  
  return { success: true, message: 'Harga berhasil disimpan!' };
}

// Save bon to sheet
function saveBon(bonData) {
  initializeSheet();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Bon Data');
  
  const itemsString = bonData.items.map(item => 
    `${item.name} x${item.qty} @ Rp${item.price}`
  ).join('; ');
  
  const total = bonData.items.reduce((sum, item) => 
    sum + (item.qty * item.price), 0
  );
  
  sheet.appendRow([
    bonData.number,
    bonData.date,
    bonData.customer,
    bonData.address,
    itemsString,
    total
  ]);
  
  return { success: true, message: 'Bon berhasil disimpan ke spreadsheet!' };
}

// Get all bons
function getAllBons() {
  initializeSheet();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Bon Data');
  const data = sheet.getDataRange().getValues();
  
  const bons = [];
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      bons.push({
        number: data[i][0],
        date: data[i][1],
        customer: data[i][2],
        address: data[i][3],
        items: data[i][4],
        total: data[i][5]
      });
    }
  }
  
  return bons;
}

// Generate bon image/preview (as HTML)
function generateBonPreview(bonData) {
  let html = '<div style="font-family: Courier New; border: 2px solid black; padding: 20px; max-width: 600px;">';
  html += '<h1 style="text-align: center; margin-bottom: 20px;">BON PENJUALAN</h1>';
  
  html += '<div style="margin-bottom: 15px;">';
  html += `<p><strong>Nomor Bon:</strong> ${bonData.number}</p>`;
  html += `<p><strong>Tanggal:</strong> ${bonData.date}</p>`;
  html += `<p><strong>Pelanggan:</strong> ${bonData.customer}</p>`;
  html += `<p><strong>Alamat:</strong> ${bonData.address}</p>`;
  html += '</div>';
  
  html += '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">';
  html += '<thead><tr style="border-bottom: 1px solid #ddd;">';
  html += '<th style="text-align: left; padding: 8px;">Item</th>';
  html += '<th style="text-align: center; padding: 8px;">Qty</th>';
  html += '<th style="text-align: right; padding: 8px;">Harga</th>';
  html += '<th style="text-align: right; padding: 8px;">Total</th>';
  html += '</tr></thead><tbody>';
  
  let total = 0;
  bonData.items.forEach(item => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    html += `<tr style="border-bottom: 1px solid #ddd;">`;
    html += `<td style="padding: 8px;">${item.name}</td>`;
    html += `<td style="text-align: center; padding: 8px;">${item.qty}</td>`;
    html += `<td style="text-align: right; padding: 8px;">Rp${formatCurrency(item.price)}</td>`;
    html += `<td style="text-align: right; padding: 8px;">Rp${formatCurrency(subtotal)}</td>`;
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  
  html += `<p style="text-align: right; font-weight: bold; font-size: 16px;">TOTAL: Rp${formatCurrency(total)}</p>`;
  html += '<p style="text-align: center; margin-top: 40px; font-size: 12px;">Terima kasih atas pembelian Anda</p>';
  html += '<p style="text-align: center; font-size: 10px; color: #666;" id="printTime"></p>';
  html += '</div>';
  
  return html;
}

function formatCurrency(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Update bon (edit)
function updateBon(bonNumber, bonData) {
  initializeSheet();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Bon Data');
  const data = sheet.getDataRange().getValues();
  
  // Find bon with matching number
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === bonNumber) {
      const itemsString = bonData.items.map(item => 
        `${item.name} x${item.qty} @ Rp${item.price}`
      ).join('; ');
      
      const total = bonData.items.reduce((sum, item) => 
        sum + (item.qty * item.price), 0
      );
      
      sheet.getRange(i + 1, 1, 1, 6).setValues([[
        bonNumber,
        bonData.date,
        bonData.customer,
        bonData.address,
        itemsString,
        total
      ]]);
      
      return { success: true, message: 'Bon berhasil diperbarui!' };
    }
  }
  
  return { success: false, message: 'Bon tidak ditemukan' };
}
