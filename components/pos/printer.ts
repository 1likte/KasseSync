export const printReceipt = (order: any, station: 'kitchen' | 'bar', categories: any[]) => {
  const isKitchen = station === 'kitchen';
  
  // Filter items based on category
  const items = order.items.filter((item: any) => {
    const cat = categories.find((c: any) => c.id === item.category_id);
    const catName = cat?.name?.toLowerCase() || '';
    const isDrink = ['içecek', 'kahve', 'bar', 'meşrubat', 'su', 'kola', 'soğuk', 'sıcak', 'çay', 'i̇çecek'].some(kw => catName.includes(kw));
    return isKitchen ? !isDrink : isDrink;
  });

  if (items.length === 0) return; // Nothing to print for this station

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const date = new Date().toLocaleDateString('tr-TR');

  const content = `
    <html>
      <head>
        <title>${station}-receipt</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: 'Courier New', Courier, monospace; 
            width: 72mm; 
            margin: 4mm auto; 
            font-size: 14px; 
            color: #000;
          }
          .header { text-align: center; margin-bottom: 15px; font-weight: bold; font-size: 18px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
          .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .bold { font-weight: bold; }
          .items { margin-top: 15px; padding-top: 10px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 16px; font-weight: bold; }
          .item-name { flex: 1; padding-right: 10px; }
          .item-qty { width: 30px; text-align: right; font-size: 18px; }
          .note { font-size: 13px; font-weight: normal; margin-left: 10px; margin-bottom: 10px; font-style: italic; }
          .separator { border-top: 1px dashed #000; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${isKitchen ? 'MUTFAK SİPARİŞİ' : 'BAR SİPARİŞİ'}</div>
          <div>${date} ${now}</div>
        </div>
        <div class="row">
          <span>Masa / İsim:</span>
          <span class="bold" style="font-size: 18px;">${order.name}</span>
        </div>
        ${order.type === 'table' && order.pax ? `<div class="row"><span>Kişi Sayısı:</span><span class="bold">${order.pax}</span></div>` : ''}
        ${order.type === 'takeaway' ? `<div class="row"><span>Sipariş Tipi:</span><span class="bold">Paket</span></div>` : ''}
        
        <div class="separator"></div>
        
        <div class="items">
          ${items.map((item: any) => `
            <div>
              <div class="item">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
              </div>
              ${item.note ? `<div class="note">Not: ${item.note}</div>` : ''}
            </div>
          `).join('')}
        </div>
        
        ${order.note ? `
          <div class="separator"></div>
          <div class="bold">Genel Sipariş Notu:</div>
          <div class="note" style="margin-left: 0; margin-top: 5px; font-weight: bold; font-size: 14px;">${order.note}</div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; margin-bottom: 30px;">
          GastroSync POS
        </div>
      </body>
    </html>
  `;

  iframe.contentWindow?.document.open();
  iframe.contentWindow?.document.write(content);
  iframe.contentWindow?.document.close();

  // Wait briefly for DOM to be ready before printing
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 250);
};
