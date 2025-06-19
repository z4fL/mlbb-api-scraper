import fs from "fs";
import path from 'path';
import Papa from "papaparse";

const csvPath = "data/heroes_detail_1.9.72.csv";
const csvFile = fs.readFileSync(csvPath, "utf8");

const parsed = Papa.parse(csvFile, {
  header: true,
  skipEmptyLines: true,
});

const jsonOutput = parsed.data.map((row) => ({
  id: parseInt(row.id),
  name: row.name,
  roles: [row.main_role, row.secondary_role].filter((role) => role !== ""),
  portrait: row.portrait,
  icon: row.icon,
  durability: Number(row.durability),
  offense: Number(row.offense),
  control_effects: Number(row.control_effects),
  difficulty: Number(row.difficulty),
  early: row.early,
  mid: row.mid,
  late: row.late,
}));

const parsedPath = path.parse(csvPath);
const jsonPath = path.join(parsedPath.dir, `${parsedPath.name}.json`);

fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2));
console.log(`✅ File JSON berhasil disimpan di: ${jsonPath}`);
