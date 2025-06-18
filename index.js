import axios from "axios";
import fs from "fs";
import Papa from "papaparse";

const BASE_URL = "https://mlbb-stats.ridwaanhall.com/api/hero-detail/";
const MAX_HERO_ID = 129;
const patchNotes = "1.9.72"

async function fetchHeroData(id) {
  try {
    const url = `${BASE_URL}${id}/?format=json`;
    const response = await axios.get(url);
    
    const heroData = response.data.data.records?.[0]?.data?.hero?.data;

    if (!heroData) return null;

    return {
      heroid: heroData.heroid || "",
      name: heroData.name || "",
      durability: heroData.abilityshow?.[0] ?? "",
      offense: heroData.abilityshow?.[1] ?? "",
      control_effects: heroData.abilityshow?.[2] ?? "",
      difficulty: heroData.abilityshow?.[3] ?? "",
      main_role: heroData.sortlabel?.[0] ?? "",
      secondary_role: heroData.sortlabel?.[1] ?? "",
    };
  } catch (err) {
    console.warn(`⚠️ Gagal ambil hero ID ${id}: ${err.message}`);
    return null;
  }
}

async function scrapeAllHeroes() {
  const allData = [];

  for (let id = 1; id <= MAX_HERO_ID; id++) {
    const hero = await fetchHeroData(id);
    
    if (hero) {
      allData.push(hero);
      console.log(`✅ Hero ID ${id} - ${hero.name} berhasil diambil`);
    }
  }

  const csv = Papa.unparse(allData);
  fs.writeFileSync(`heroes_detail_${patchNotes}.csv`, csv, "utf8");
  console.log("✅ Berhasil simpan file");
}

scrapeAllHeroes();
