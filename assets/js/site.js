let wizardData = { hizmet: "", startstop: "Belirtilmedi", amper: "Belirtilmedi", marka: "", konum: "" };

function scrollToWizard() { document.getElementById('akuSihirbazi').scrollIntoView({ behavior: 'smooth' }); }

function selectOption(key, value, currentStep) {
    wizardData[key] = value;
    const stepDiv = document.getElementById(`step${currentStep}`);
    const cards = stepDiv.querySelectorAll('.option-card');
    cards.forEach(card => { if(card.innerText.includes(value) || card.innerText === value) { card.classList.add('selected'); } else { card.classList.remove('selected'); } });

    if (currentStep === 1) {
        if (value.includes("Değişimi")) {
            document.getElementById('degisimSorulari').style.display = "block";
            document.getElementById('takviyeSorulari').style.display = "none";
        } else {
            document.getElementById('degisimSorulari').style.display = "none";
            document.getElementById('takviyeSorulari').style.display = "block";
            wizardData.startstop = "Takviye Hizmeti (Gerekmiyor)";
        }
        nextStep(2);
    } else if (currentStep === 2) {
        if (!wizardData.hizmet.includes("Değişimi") || (wizardData.startstop !== "Belirtilmedi" && wizardData.amper !== "Belirtilmedi")) { nextStep(3); }
    }
}

function nextStep(stepNumber) {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');
    document.getElementById('wizardProgress').style.width = `${(stepNumber / 4) * 100}%`;
}

function prevStep(stepNumber) {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');
    document.getElementById('wizardProgress').style.width = `${(stepNumber / 4) * 100}%`;
}

function processStep3() {
    wizardData.marka = document.getElementById('wizMarka').value || "Belirtilmedi";
    wizardData.konum = document.getElementById('wizKonum').value || "Belirtilmedi";
    if(!wizardData.hizmet.includes("Değişimi")) { wizardData.amper = wizardData.amper_takviye || "Belirtilmedi"; }

    document.getElementById('summaryBox').innerHTML = `
                🔄 <b>Hizmet:</b> ${wizardData.hizmet}<br>
                🚗 <b>Araç:</b> ${wizardData.marka}<br>
                ⚡ <b>Amper:</b> ${wizardData.amper}<br>
                ⚙️ <b>Start-Stop:</b> ${wizardData.startstop}<br>
                📍 <b>Konum:</b> ${wizardData.konum}
    `;

            // 💬 MADDE 2: WHATSAPP ŞABLONUNU HAZIR METİN HALİNE GETİRDİK
    const waMessage = `Merhaba Jet Akü Ustası, web sitenizdeki akü sihirbazından fiyat teklifi almak istiyorum:\n\n` +
`• Hizmet: ${wizardData.hizmet}\n` +
`• Araç Marka/Model: ${wizardData.marka}\n` +
`• Akü Amperi: ${wizardData.amper}\n` +
`• Start-Stop Durumu: ${wizardData.startstop}\n` +
`• Konumum: ${wizardData.konum}`;

document.getElementById('whatsappWizLink').href = `https://wa.me/905551663380?text=${encodeURIComponent(waMessage)}`;
nextStep(4);
}

const districts = [
    { name: "Ayvacık", region: "anadolu", seo: "ayvacik" }, { name: "Eceabat", region: "avrupa", seo:"eceabat" }, { name: "Bayramiç", region: "anadolu", seo:"bayramic" },
    { name: "Gelibolu", region: "avrupa", seo: "gelibolu" }, { name: "Biga", region: "anadolu", seo:"biga" }, { name: "Bozcaada", region: "anadolu", seo:"bozcaada" },
    { name: "Çan", region: "anadolu", seo:"can" }, { name: "Ezine", region: "anadolu", seo:"ezine" }, { name: "Gökçeada", region: "anadolu", seo:"gokceada" },
    { name: "Lapseki", region: "anadolu", seo:"lapseki" }, { name: "Yenice", region: "anadolu", seo:"yenice" },
    { name: "Kepez", region: "anadolu", seo: "kepez" }, { name: "Geyikli", region: "anadolu", seo: "geyikli" },
    { name: "Karabiga", region: "anadolu", seo: "karabiga" }, { name: "Çardak", region: "anadolu", seo: "cardak" },
    { name: "Umurbey", region: "anadolu", seo: "umurbey" },
    { name: "Küçükkuyu", region: "anadolu", seo: "kucukkuyu" }, { name: "Assos", region: "anadolu", seo: "assos" },
    { name: "Güzelyalı", region: "anadolu", seo: "guzelyali" }, { name: "Dardanos", region: "anadolu", seo: "dardanos" },
    { name: "Gümüşçay", region: "anadolu", seo: "gumuscay" }
];

function renderCards(data) {
    const grid = document.getElementById('districtGrid'); if(!grid) return; grid.innerHTML = "";
    data.forEach(item => {
        const badgeClass = item.region === 'avrupa' ? 'badge-avrupa' : 'badge-anadolu';
        const statusText = item.region === 'anadolu' ? 'AKTİF MOBİL EKİP' : 'TALEP ÜZERİNE SERVİS';
        const statusClass = item.region === 'anadolu' ? 'status-active' : 'status-request';
        grid.innerHTML += `<div class="district-card" onclick="goToLocation('${item.seo}', '${item.region}')"><div class="card-title">${item.name}</div><span class="card-badge ${badgeClass}">${item.region}</span><div class="card-status ${statusClass}">${statusText}</div></div>`;
    });
}

function toggleMenu() { document.getElementById('navMenu').classList.toggle('active'); }
function toggleSubMenu(id, e) { if (window.innerWidth <= 768) { if(e) e.stopPropagation(); document.getElementById(id).classList.toggle('mobile-open'); } }
function filterRegion(region, btn) { document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); if(region === 'tum') { renderCards(districts); } else { renderCards(districts.filter(d => d.region === region)); } }
function searchDistricts() { renderCards(districts.filter(d => d.name.toLowerCase().includes(document.getElementById('liveSearch').value.toLowerCase()))); }
function goToLocation(name, reg) { window.location.href = `./${encodeURIComponent(name)}`; }
function goToBrand(brandName) {
    const markaInput = document.getElementById('wizMarka');
    if (markaInput) { markaInput.value = brandName + " "; }
    scrollToWizard();
}

window.onload = function() {
    renderCards(districts);
    const avrupaMenu = document.getElementById('avrupaSubDropdown'); const anadoluMenu = document.getElementById('anadoluSubDropdown');
    if(avrupaMenu && anadoluMenu) {
        districts.sort((a,b) => a.name.localeCompare(b.name, 'tr')).forEach(item => {
            const liHTML = `<li><a class="dropdown-link" onclick="goToLocation('${item.seo}', '${item.region}')">${item.name}</a></li>`;
            if(item.region === 'avrupa') { avrupaMenu.innerHTML += liHTML; } else { anadoluMenu.innerHTML += liHTML; }
        });
    }
};

// 📍 GPS Konumunu WhatsApp Mesajına Ekleyen Uber-Tarzı Fonksiyon
function shareGPSLocation() {
    const defaultMessage = "Merhaba Jet Akü Ustası, yolda kaldım. Yol yardım ve fiyat teklifi almak istiyorum.";
    const defaultUrl = `https://wa.me/905551663380?text=${encodeURIComponent(defaultMessage)}`;
    
    if (navigator.geolocation) {
        // Butonlardaki yazıyı yükleniyor durumuna getir
        const buttons = document.querySelectorAll('.sub-whatsapp-btn, .btn-whatsapp');
        const originalTexts = [];
        buttons.forEach((btn, index) => {
            originalTexts[index] = btn.innerHTML;
            btn.innerHTML = "📍 Konumunuz Bulunuyor...";
        });
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
                const gpsMessage = `Merhaba Jet Akü Ustası, yolda kaldım. Yol yardım ve fiyat teklifi almak istiyorum. Canlı Harita Konumum: ${mapLink}`;
                const waUrl = `https://wa.me/905551663380?text=${encodeURIComponent(gpsMessage)}`;
                
                // Buton yazılarını sıfırla
                buttons.forEach((btn, index) => {
                    btn.innerHTML = originalTexts[index];
                });
                
                // WhatsApp'a yönlendir
                window.open(waUrl, '_blank');
            },
            function(error) {
                console.log("GPS hatası alındı, varsayılan WhatsApp yönlendirmesi yapılıyor:", error);
                buttons.forEach((btn, index) => {
                    btn.innerHTML = originalTexts[index];
                });
                window.open(defaultUrl, '_blank');
            },
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
        );
    } else {
        window.open(defaultUrl, '_blank');
    }
}

// ⏱️ Saat bazlı Nöbetçi Ekip durum göstergesi güncelleme
function updateLiveStatusDot() {
    const statusTextEl = document.querySelector('.navbar-status span:last-child');
    if (!statusTextEl) return;
    
    const currentHour = new Date().getHours();
    
    // Gece Modu: 20:00 - 08:00
    if (currentHour >= 20 || currentHour < 8) {
        statusTextEl.textContent = "7/24 GECE NÖBETÇİ EKİPLER AKTİF";
        const dot = document.querySelector('.status-dot');
        if (dot) {
            dot.style.background = "#10b981";
            dot.style.boxShadow = "0 0 12px #10b981";
        }
    } else {
        statusTextEl.textContent = "7/24 GEZİCİ EKİPLER SAHADA";
    }
}

// Sayfa yüklendiğinde butonları dinle ve saat durumunu güncelle
document.addEventListener('DOMContentLoaded', () => {
    updateLiveStatusDot();
    
    document.querySelectorAll('.sub-whatsapp-btn, .btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            shareGPSLocation();
        });
    });
});