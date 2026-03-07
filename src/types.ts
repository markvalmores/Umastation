export interface Character {
  id: number;
  name_en: string;
  name_jp: string;
  preferred_url: string;
  sns_icon?: string;
  thumb_img?: string;
  birth_day?: number;
  birth_month?: number;
}

export interface GachaPickup {
  id: number;
  chara_id: number;
  rarity: number;
  chara_data: Character;
}

export interface GachaBanner {
  id: number;
  image_url: string;
  end_date: number;
  card_type: "Outfit" | "Support";
  pickups: GachaPickup[];
}

export interface BirthdayData {
  current_birthdays: Character[];
  next_birthdays: Character[];
}

export interface NewsItem {
  announce_id: number;
  title_english: string;
  title: string;
  post_at: number;
  message_english: string;
  image: string;
}

export interface Album {
  id: number;
  name_en: string;
  name_jp: string;
  image_url: string;
  album_art?: string;
  release_date: string;
}

export interface Track {
  id: number;
  name_en: string;
  name_jp: string;
  preview_url: string | null;
  _singers?: { chara_name_en: string }[];
}
