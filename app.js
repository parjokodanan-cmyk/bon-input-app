// Data store
let priceList = [];
let bons = [];
let currentBonIndex = -1;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadPriceList();
    loadBons();
    populateItemSelect();
    renderPriceListTable();
    loadBonsList();
    setTodayDate();
});

// Set today's date by default
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bonDate').value = today;
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// ===== PRICE LIST FUNCTIONS =====
function loadPriceList() {
    const saved = localStorage.getItem('priceList');
    if (saved) {
        priceList = JSON.parse(saved);
    } else {
        // Default items
        priceList = [
            { id: 1, name: 'BLD', price: 53000 },
            { id: 2, name: 'BLP', price: 0 },
            { id: 3, name: 'Paha atas', price: 0 },
            { id: 4, name: 'Paha', price: 0 },
            { id: 5, name: 'Sayap', price: 0 },
            { id: 6, name: 'Kepala', price: 0 },
            { id: 7, name: 'Kulit', price: 0 },
            { id: 8, name: 'Tulang', price: 0 },
            { id: 9, name: 'Ceker', price: 0 },
            { id: 10, name: 'Ati', price: 0 }
        ];
        savePriceList();
    }
}

function savePriceList() {
    localStorage.setItem('priceList', JSON.stringify(priceList));
    showAlert('listAlert', 'Data harga berhasil disimpan!', 'success');
}

function renderPriceListTable() {
    const tbody = document.getElementById('priceListTable');
    tbody.innerHTML = '';
    
    priceList.forEach((item, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td class="currency">Rp${formatCurrency(item.price)}</td>
            <td>
                <button class="btn btn-danger" onclick="deletePriceItem(${index})">Hapus</button>
            </td>
        `;
    });
}

function addItemToList() {
    const name = document.getElementById('newItemName').value.trim();
    const price = parseInt(document.getElementById('newItemPrice').value) || 0;
    
    if (!name) {
        showAlert('listAlert', 'Nama item tidak boleh kosong!', 'error');
        return;
    }
    
    // Check if item already exists
    if (priceList.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        showAlert('listAlert', 'Item sudah ada dalam daftar!', 'error');
        return;
    }
    
    priceList.push({
        id: Date.now(),
        name: name,
        price: price
    });
    
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemPrice').value = '';
    
    renderPriceListTable();
    populateItemSelect();
}

function deletePriceItem(index) {
    if (confirm('Yakin ingin menghapus item ini?')) {
        priceList.splice(index, 1);
        renderPriceListTable();
        populateItemSelect();
    }
}

function resetPriceForm() {
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemPrice').value = '';
}

// ===== BON FUNCTIONS =====
function populateItemSelect() {
    const select = document.getElementById('itemSelect');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">Pilih Item</option>';
    priceList.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (Rp${formatCurrency(item.price)})`;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}

document.addEventListener('change', function(e) {
    if (e.target.id === 'itemSelect') {
        const selectedId = e.target.value;
        if (selectedId) {
            const item = priceList.find(p => p.id == selectedId);
            document.getElementById('itemPrice').value = item ? item.price : 0;
        } else {
            document.getElementById('itemPrice').value = 0;
        }
    }
});

function addItem() {
    const itemSelect = document.getElementById('itemSelect');
    const itemQty = parseInt(document.getElementById('itemQty').value) || 1;
    const itemPrice = parseInt(document.getElementById('itemPrice').value) || 0;
    
    if (!itemSelect.value) {
        showAlert(null, 'Pilih item terlebih dahulu!', 'error');
        return;
    }
    
    const selectedItem = priceList.find(p => p.id == itemSelect.value);
    
    if (!currentBonData) {
        currentBonData = {
            date: document.getElementById('bonDate').value,
            number: document.getElementById('bonNumber').value,
            customer: document.getElementById('customerName').value,
            address: document.getElementById('customerAddress').value,
            items: []
        };
    }
    
    currentBonData.items.push({
        id: Date.now(),
        name: selectedItem.name,
        qty: itemQty,
        price: itemPrice
    });
    
    renderItemsTable();
    document.getElementById('itemQty').value = 1;
    itemSelect.value = '';
    document.getElementById('itemPrice').value = 0;
}

function renderItemsTable() {
    if (!currentBonData || currentBonData.items.length === 0) {
        document.getElementById('itemsTableContainer').style.display = 'none';
        document.getElementById('emptyItems').style.display = 'block';
        document.getElementById('totalAmount').textContent = 'Rp0';
        return;
    }
    
    document.getElementById('itemsTableContainer').style.display = 'block';
    document.getElementById('emptyItems').style.display = 'none';
    
    const tbody = document.getElementById('itemsTable');
    tbody.innerHTML = '';
    
    let total = 0;
    currentBonData.items.forEach((item, index) => {
        const subtotal = item.qty * item.price;
        total += subtotal;
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td class="currency">Rp${formatCurrency(item.price)}</td>
            <td class="currency">Rp${formatCurrency(subtotal)}</td>
            <td>
                <button class="btn btn-danger" onclick="removeItem(${index})">Hapus</button>
            </td>
        `;
    });
    
    document.getElementById('totalAmount').textContent = `Rp${formatCurrency(total)}`;
}

function removeItem(index) {
    if (currentBonData && currentBonData.items.length > 0) {
        currentBonData.items.splice(index, 1);
        renderItemsTable();
    }
}

let currentBonData = null;

function saveBon() {
    const date = document.getElementById('bonDate').value;
    const number = document.getElementById('bonNumber').value;
    const customer = document.getElementById('customerName').value;
    const address = document.getElementById('customerAddress').value;
    
    if (!date || !number || !customer || !address) {
        showAlert(null, 'Semua field harus diisi!', 'error');
        return;
    }
    
    if (!currentBonData || currentBonData.items.length === 0) {
        showAlert(null, 'Tambahkan minimal satu item!', 'error');
        return;
    }
    
    currentBonData.date = date;
    currentBonData.number = number;
    currentBonData.customer = customer;
    currentBonData.address = address;
    
    // Save to bons array
    const existingIndex = bons.findIndex(b => b.number === number);
    if (existingIndex > -1) {
        bons[existingIndex] = JSON.parse(JSON.stringify(currentBonData));
    } else {
        bons.push(JSON.parse(JSON.stringify(currentBonData)));
    }
    
    localStorage.setItem('bons', JSON.stringify(bons));
    loadBonsList();
    generatePreview();
}

function generatePreview() {
    if (!currentBonData) return;
    
    let previewText = '';
    previewText += `╔════════════════════════════════════╗\n`;
    previewText += `║         BON PENJUALAN              ║\n`;
    previewText += `╚════════════════════════════════════╝\n\n`;
    
    previewText += `Nomor Bon    : ${currentBonData.number}\n`;
    previewText += `Tanggal      : ${formatDate(currentBonData.date)}\n`;
    previewText += `Pelanggan    : ${currentBonData.customer}\n`;
    previewText += `Alamat       : ${currentBonData.address}\n\n`;
    
    previewText += `────────────────────────────────────\n`;
    previewText += `ITEM                  QTY    HARGA      TOTAL\n`;
    previewText += `────────────────────────────────────\n`;
    
    let total = 0;
    currentBonData.items.forEach(item => {
        const subtotal = item.qty * item.price;
        total += subtotal;
        previewText += `${padRight(item.name, 20)}${padRight(item.qty.toString(), 5)}${padRight('Rp' + formatCurrency(item.price), 12)}Rp${formatCurrency(subtotal)}\n`;
    });
    
    previewText += `────────────────────────────────────\n`;
    previewText += `TOTAL${padRight('', 29)}Rp${formatCurrency(total)}\n`;
    previewText += `────────────────────────────────────\n\n`;
    previewText += `Terima kasih!\n`;
    previewText += `Tanggal cetak: ${new Date().toLocaleString('id-ID')}\n`;
    
    document.getElementById('bonPreview').textContent = previewText;
    document.getElementById('previewSection').style.display = 'block';
}

function loadBons() {
    const saved = localStorage.getItem('bons');
    if (saved) {
        bons = JSON.parse(saved);
    }
}

function loadBonsList() {
    const select = document.getElementById('evalBonNumber');
    select.innerHTML = '<option value="">Pilih bon untuk diedit</option>';
    
    bons.forEach((bon, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${bon.number} - ${bon.customer} (${formatDate(bon.date)})`;
        select.appendChild(option);
    });
}

function loadBonData() {
    const index = document.getElementById('evalBonNumber').value;
    
    if (index === '') {
        document.getElementById('evalContent').style.display = 'none';
        document.getElementById('emptyEval').style.display = 'block';
        return;
    }
    
    currentBonIndex = parseInt(index);
    const bon = bons[currentBonIndex];
    
    document.getElementById('evalDate').value = bon.date;
    document.getElementById('evalCustomerName').value = bon.customer;
    document.getElementById('evalCustomerAddress').value = bon.address;
    
    renderEvalItemsTable();
    
    document.getElementById('evalContent').style.display = 'block';
    document.getElementById('emptyEval').style.display = 'none';
}

function renderEvalItemsTable() {
    const bon = bons[currentBonIndex];
    const tbody = document.getElementById('evalItemsTable');
    tbody.innerHTML = '';
    
    let total = 0;
    bon.items.forEach((item, index) => {
        const subtotal = item.qty * item.price;
        total += subtotal;
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>
                <input type="text" value="${item.name}" style="width: 100%; padding: 5px;" class="eval-item-name" data-index="${index}">
            </td>
            <td>
                <input type="number" value="${item.qty}" style="width: 100%; padding: 5px;" class="eval-item-qty" data-index="${index}" min="1">
            </td>
            <td class="currency">
                <input type="number" value="${item.price}" style="width: 100%; padding: 5px; text-align: right;" class="eval-item-price" data-index="${index}" min="0">
            </td>
            <td class="currency">Rp${formatCurrency(subtotal)}</td>
            <td>
                <button class="btn btn-danger" onclick="removeEvalItem(${index})">Hapus</button>
            </td>
        `;
    });
}

function removeEvalItem(index) {
    if (bons[currentBonIndex]) {
        bons[currentBonIndex].items.splice(index, 1);
        renderEvalItemsTable();
    }
}

function updateBon() {
    const bon = bons[currentBonIndex];
    bon.date = document.getElementById('evalDate').value;
    bon.customer = document.getElementById('evalCustomerName').value;
    bon.address = document.getElementById('evalCustomerAddress').value;
    
    // Update items from form
    const nameInputs = document.querySelectorAll('.eval-item-name');
    const qtyInputs = document.querySelectorAll('.eval-item-qty');
    const priceInputs = document.querySelectorAll('.eval-item-price');
    
    nameInputs.forEach((input, index) => {
        bon.items[index].name = input.value;
        bon.items[index].qty = parseInt(qtyInputs[index].value) || 0;
        bon.items[index].price = parseInt(priceInputs[index].value) || 0;
    });
    
    localStorage.setItem('bons', JSON.stringify(bons));
    showAlert(null, 'Bon berhasil diperbarui!', 'success');
    
    setTimeout(() => {
        switchTab('bon');
        resetForm();
    }, 1500);
}

function resetForm() {
    document.getElementById('bonDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('bonNumber').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('itemSelect').value = '';
    document.getElementById('itemQty').value = 1;
    document.getElementById('itemPrice').value = 0;
    
    currentBonData = null;
    renderItemsTable();
    document.getElementById('previewSection').style.display = 'none';
}

// ===== DOWNLOAD & PRINT =====
function downloadAsImage() {
    const previewDiv = document.getElementById('bonPreview');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 1000;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BON PENJUALAN', canvas.width / 2, 50);
    
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    let y = 100;
    const lines = previewDiv.textContent.split('\n');
    
    lines.forEach(line => {
        if (line.trim()) {
            ctx.fillText(line, 40, y);
            y += 20;
        }
    });
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `bon-${currentBonData.number}.png`;
    link.click();
}

function printBon() {
    const printWindow = window.open('', '', 'height=600,width=800');
    const bonNumber = currentBonData.number;
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Cetak Bon ${bonNumber}</title>
        <style>
            body { font-family: 'Courier New', monospace; margin: 20px; }
            .bon { border: 2px solid black; padding: 20px; max-width: 600px; margin: 0 auto; }
            h1 { text-align: center; margin-bottom: 20px; }
            .info { margin-bottom: 15px; }
            .info p { margin: 5px 0; }
            table { width: 100%; margin: 20px 0; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { font-weight: bold; font-size: 16px; text-align: right; padding-right: 10px; }
            @media print { body { margin: 0; } }
        </style>
    </head>
    <body>
        <div class="bon">
            <h1>BON PENJUALAN</h1>
            <div class="info">
                <p><strong>Nomor Bon:</strong> ${currentBonData.number}</p>
                <p><strong>Tanggal:</strong> ${formatDate(currentBonData.date)}</p>
                <p><strong>Pelanggan:</strong> ${currentBonData.customer}</p>
                <p><strong>Alamat:</strong> ${currentBonData.address}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Harga</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentBonData.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td style="text-align: center;">${item.qty}</td>
                            <td style="text-align: right;">Rp${formatCurrency(item.price)}</td>
                            <td style="text-align: right;">Rp${formatCurrency(item.qty * item.price)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p class="total">TOTAL: Rp${formatCurrency(currentBonData.items.reduce((sum, item) => sum + (item.qty * item.price), 0))}</p>
            <p style="text-align: center; margin-top: 40px; font-size: 12px;">Terima kasih atas pembelian Anda</p>
        </div>
        <script>
            window.print();
        </script>
    </body>
    </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function padRight(str, length) {
    return (str + ' '.repeat(length)).substring(0, length);
}

function showAlert(elementId, message, type) {
    if (elementId) {
        const alert = document.getElementById(elementId);
        alert.textContent = message;
        alert.className = `alert alert-${type}`;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}