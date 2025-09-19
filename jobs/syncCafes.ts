import { Any } from "@strapi/types/dist/types/core/attributes/common";
import type * as Data from "@strapi/types/dist/modules/entity-service/params/data";
import * as _ from "lodash";

type Profil = Partial<Data.Input<"api::reparaturcafe.reparaturcafe">>;
type Category = Partial<Data.Input<"api::product-category.product-category">>;

const importDate = new Date();

type WorkshopCategory = {
  id: number;
  label: string;
  iconUrl: string;
};

type Workshop = {
  id: number;
  name: string;
  city: string;
  postalCode: string;
  street: string;
  street2?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  landingPage: string;
  logoUrl: string;
  ExternImportId: string;
  category: WorkshopCategory[];
  nextEvent?: string;
};

type WorkshopResponse = {
  workshops: Workshop[];
};

const config = {
  sourceUrl:
    "https://www.reparatur-initiativen.de/api/v1/workshops?city=Berlin",
};

async function fetchReparaturcafes(): Promise<WorkshopResponse> {
  const headers = {
    "content-type": "application/json",
  };
  const request = await fetch(config.sourceUrl, {
    method: "GET",
    headers: headers,
  });
  return (await request.json()) as WorkshopResponse;
}

function mapToReparaturcafe(
  src: Workshop,
  categories: Category[]
): Profil | null {
  const categoryMapping = {
    "3D-Reparatur": null,
    Computer: ["PC/Computer", "Laptop/Notebook"],
    "Elektro divers": [
      "Büromaschinen",
      "Schreibmaschinen",
      "Sonstige Büromaschinen (Drucker, Kopierer etc.)",
      "Sonstige Informations- und Kommunikationstechnik",
      "Spielzeug",
      "Werkzeuge",
      "Gartengeräte",
      "Informations- und Kommunikationstechnik",
      "Nähmaschinen",
      "Lampen"
    ],
    Fahrrad: [
      "Fahrräder",
      "Sonstige Fahrräder",
      "E-Bike/Pedelec"
    ],
    Haushaltsgeräte: [
      "Kleine Haushaltsgeräte",
      "Kaffeemaschinen",
      "Küchenmaschinen (Thermomix etc.)",
      "Staubsauger",
      "Sonstige Haushaltskleingeräte (Fön, Rasierer etc.)"
    ],
    Leder: [
      "Lederwaren",
      "Lederschuhe"
    ],
    Metallbearbeitung: [
      "Metallgegenstände",
      "Schleifarbeit (Messer etc.)",
      "Sonstige Metallgegenstände"
    ],
    "Möbel/Holz": [
      "Möbel",
      "Glasmöbel",
      "Holzmöbel",
      "Polstermöbel",
      "Sonstige Möbel"
    ],
    Schmuck: [
      "Schmuck",
      "Schmuck/Uhren"
    ],
    "Smartphone/Tablet": [
      "Smartphone/Handy",
      "Tablet",
      "Informations- und Kommunikationstechnik"
    ],
    Textilien: [
      "Kleidung/Textilien",
      "Schuhe",
      "Sneaker",
      "Sonstige Schuhe"
    ],
    Unterhaltungselektronik: [
      "Unterhaltungselektronik (Braune Ware)",
      "CD-/DVD-Player",
      "HiFi-Geräte/Stereo-Anlagen",
      "Lautsprecher",
      "Plattenspieler",
      "Radio",
      "Spielekonsole",
      "TV/Fernseher",
      "Sonstige Unterhaltungselektronik"
    ],
    "Upcycling/Basteln": null,
  };

  const nextEventISO = src.nextEvent
    ? convertGermanDateToISO(src.nextEvent)
    : null;

  return {
    id: undefined,
    Name: src.name,
    City: src.city,
    PostalCode: src.postalCode,
    Street: src.street,
    Street2: src.street2 || "",
    Coordinates: {
      description: "Taken from coordinates on import",
      lat: src.coordinates.lat,
      lng: src.coordinates.lng,
    },
    Landingpage: src.landingPage,
    logoUrl: src.logoUrl,
    ExternImportId: String(src.id),
    publishedAt: importDate,
    product_categories: src.category.reduce((result, category) => {
      if (categoryMapping.hasOwnProperty(category.label)) {
        const mappedCategories = categoryMapping[category.label];

        if (mappedCategories === null) {
          return result;
        }

        const mappedCategoryIds = mappedCategories
          .map((mappedCategory) => {
            const matchingCategory = categories.find(
              (x) => x.Label === mappedCategory
            );

            if (matchingCategory) {
              return String(matchingCategory.id);
            }

            console.log(
              `Skipping category ${mappedCategory} for reparaturcafe ${src.name} because of missing match.`
            );
            return null;
          })
          .filter(Boolean);

        return result.concat(mappedCategoryIds);
      }

      const matchingCategory = categories.find(
        (x) => x.Label === category.label
      );

      if (matchingCategory) {
        return result.concat(String(matchingCategory.id));
      }

      console.log(
        `Skipping category ${category.label} for reparaturcafe ${src.name} because of missing match.`
      );
      return result;
    }, [] as string[]),
    NextEvent: nextEventISO ? new Date(nextEventISO) : null,
  };
}

function convertGermanDateToISO(dateString: string): string | null {
  const parts = dateString.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!parts) return null;
  const [, day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

function normalizeProfileBeforeCompare(obj: Profil) {
  obj = _.cloneDeep(obj);
  delete obj.publishedAt;
  delete obj.id;
  delete obj.logoUrl;
  delete obj.createdBy;
  delete obj.updatedBy;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.product_categories; // TODO
  for (let key in obj) {
    if (obj[key] === undefined) {
      obj[key] = null;
    }
  }
  return obj;
}

function hasChanges(src: Profil, dst: Profil): boolean {
  src = normalizeProfileBeforeCompare(src);
  dst = normalizeProfileBeforeCompare(dst);
  return _.isEqual(src, dst) === false;
}

export async function syncCafes(): Promise<void> {
  console.log("Syncing reparaturcafes");
  const srcReparaturcafes = (await fetchReparaturcafes()).workshops;
  let c = srcReparaturcafes.length;
  console.log(`SYNC ${c} REPARATURCAFES ${new Date()}`);
  const dstReparaturcafes = await strapi.entityService.findMany(
    "api::reparaturcafe.reparaturcafe",
    { populate: "*" }
  );

  const categories = await strapi.entityService.findMany(
    "api::product-category.product-category"
  );
  let listOfAllSrcReparaturCafeId: Array<string> = []
  for (let srcReparaturcafe of srcReparaturcafes) {
    c--;
    const existingReparaturcafe = dstReparaturcafes.find(
      (x) => x.ExternImportId === String(srcReparaturcafe.id)
    );
    listOfAllSrcReparaturCafeId.push(srcReparaturcafe.id.toString());
    let reparaturcafe = mapToReparaturcafe(srcReparaturcafe, categories);
    if (reparaturcafe) {
      if (existingReparaturcafe) {
        if (hasChanges(reparaturcafe, existingReparaturcafe)) {
          reparaturcafe.id = existingReparaturcafe.id;
          console.log(`UPDATE ${c + 1}: ${srcReparaturcafe.name}`);
          await strapi.entityService.update(
            "api::reparaturcafe.reparaturcafe",
            reparaturcafe.id,
            {
              data: reparaturcafe,
            }
          );
        }
      } else {
        console.log(`CREATE ${c + 1}: ${srcReparaturcafe.name}`);
        await strapi.entityService.create("api::reparaturcafe.reparaturcafe", {
          data: reparaturcafe,
        });
      }
    }
  }

  console.log("Start removing of DEAD reaparaturcafes");
  let counter = 0

  const updatedDstReparaturcafes = await strapi.entityService.findMany(
    "api::reparaturcafe.reparaturcafe",
    { populate: "*" }
  );
  for (let updatedDstReparaturcafe of updatedDstReparaturcafes) {

    if (!listOfAllSrcReparaturCafeId.includes(updatedDstReparaturcafe.ExternImportId)) {
      console.log("DELETE : " + updatedDstReparaturcafe.Name + " with ExternId: " + updatedDstReparaturcafe.ExternImportId);
      await strapi.entityService.delete(
        "api::reparaturcafe.reparaturcafe",
        updatedDstReparaturcafe.id
      );
      counter++
    }
  }
  if (counter === 0) {
    console.log("NO ENTRIES DELETED");
  } else {
    console.log("DELETED entries: " + counter);
  }


  console.log(
    `SYNC REPARATURCAFES ${srcReparaturcafes.length} IS DONE ${new Date()}`
  );
}
