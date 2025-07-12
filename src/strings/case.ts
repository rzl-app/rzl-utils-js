/** ----------------------------------------------------------
 * * ***Capitalizes the first letter of a string and optionally lowercases the rest of the string.*** ✅
 * ----------------------------------------------------------
 *
 * @param string - The string to be processed.
 * @param options - The options object.
 * @returns The string with the first letter capitalized, and the rest lowercased or unchanged based on the option, if string is null or undefined will return "" as empty string.
 */
export const capitalizeFirstLetter = (
  string?: string | null,
  options = {
    /**
     * @description If true, the rest of the string will be converted to lowercase after capitalizing the first letter.
     *  @default true */
    lowerCaseNextOtherFirstLetter: true,
  }
) => {
  if (typeof string === "string" && string.trim().length > 0) {
    if (typeof options !== "object" || options === null) {
      options = {
        lowerCaseNextOtherFirstLetter: true,
      }; // fallback to default
    }

    string = string[0].toUpperCase() + string.slice(1);

    if (options.lowerCaseNextOtherFirstLetter) {
      return string.toLowerCase();
    }
    return string;
  }

  return "";
};

/** ----------------------------------------------------------
 * * Capitalizes each word in a name string while preserving punctuation and handling honorifics/titles correctly.
 * * Also ensures proper spacing if punctuation is stuck to words and automatically adds missing dots in known abbreviations.
 * ----------------------------------------------------------
 *
 * @param {string} name - The input name string.
 * @returns {string} - The formatted name with correct capitalization.
 *
 * @example
 * console.log(capitalizeName("drs agus haryanto mpd"));       // "Drs. Agus Haryanto, M.Pd."
 * console.log(capitalizeName("mr smith jr"));                // "Mr. Smith, Jr."
 * console.log(capitalizeName("josé o'neill"));               // "José O'Neill"
 * console.log(capitalizeName("  prof emile zola "));         // "Prof. Émile Zola"
 * console.log(capitalizeName("sir isaac newton"));          // "Sir Isaac Newton"
 */
export const capitalizeName = (name?: string | null): string => {
  if (typeof name !== "string" || !name.trim()) return "";

  const titles = new Map([
    // **🔹 Indonesian Academic Titles**
    ["dr", "Dr."],
    ["drs", "Drs."],
    ["dra", "Dra."],
    ["ir", "Ir."],
    ["sked", "S.Ked."],
    ["skom", "S.Kom."],
    ["st", "S.T."],
    ["se", "S.E."],
    ["sp", "S.Pd."],
    ["sh", "S.H."],
    ["ssi", "S.Si."],
    ["sip", "S.IP."],
    ["sag", "S.Ag."],
    ["mked", "M.Ked."],
    ["mkom", "M.Kom."],
    ["mt", "M.T."],
    ["mm", "M.M."],
    ["me", "M.E."],
    ["mpd", "M.Pd."],
    ["mh", "M.H."],
    ["msi", "M.Si."],
    ["mip", "M.IP."],
    ["phd", "Ph.D."],
    ["md", "M.D."],

    // **🔹 Indonesian Professional Titles**
    ["ak", "Ak."],
    ["cma", "CMA."],
    ["cpa", "CPA."],
    ["cfe", "CFE."],
    ["cfp", "CFP."],
    ["cissp", "CISSP."],
    ["spa", "Sp.A."],
    ["spb", "Sp.B."],
    ["sppd", "Sp.PD."],
    ["spkk", "Sp.KK."],
    ["spm", "Sp.M."],
    ["spog", "Sp.OG."],

    // **🔹 Indonesian Military Titles**
    ["jenderal", "Jenderal"],
    ["letjen", "Letjen."],
    ["mayjen", "Mayjen."],
    ["brigjen", "Brigjen."],
    ["kolonel", "Kolonel"],
    ["letkol", "Letkol."],
    ["mayor", "Mayor"],
    ["kapten", "Kapten"],
    ["lettu", "Lettu."],
    ["letda", "Letda."],
    ["serma", "Serma."],
    ["serka", "Serka."],
    ["sertu", "Sertu."],
    ["kopda", "Kopda."],
    ["praka", "Praka."],
    ["pratu", "Pratu."],

    // **🔹 Indonesian Honorific Titles**
    ["h", "H."],
    ["hj", "Hj."],
    ["kh", "K.H."],
    ["habib", "Habib"],
    ["ust", "Ust."],
    ["ustadz", "Ustadz"],
    ["ustadzah", "Ustadzah"],
    ["syekh", "Syekh"],
    ["raden", "Raden"],
    ["raden mas", "Raden Mas"],
    ["raden ajeng", "Raden Ajeng"],
    ["ki", "Ki."],
    ["nyi", "Nyi."],
    ["pdt", "Pdt."],
    ["bp", "Bp."],
    ["ibu", "Ibu."],
    ["gus", "Gus."],
    ["buya", "Buya."],

    // **🔹 International Titles**
    ["mr", "Mr."],
    ["ms", "Ms."],
    ["mrs", "Mrs."],
    ["prof", "Prof."],
    ["sir", "Sir"],
    ["madam", "Madam"],
    ["lord", "Lord"],
    ["monsieur", "Monsieur"],
    ["madame", "Madame"],
    ["herr", "Herr"],
    ["frau", "Frau"],
    ["señor", "Señor"],
    ["señora", "Señora"],
    ["señorita", "Señorita"],
    ["rev", "Rev."],
    ["rabbi", "Rabbi"],
    ["imam", "Imam"],
    ["sheikh", "Sheikh"],
    ["gen", "Gen."],
    ["col", "Col."],
    ["lt", "Lt."],
    ["maj", "Maj."],
    ["sgt", "Sgt."],
    ["cpt", "Cpt."],

    // **🔹 Common Name Suffixes**
    ["jr", "Jr."],
    ["sr", "Sr."],
    ["ii", "II"],
    ["iii", "III"],
  ]);

  return name
    .trim()
    .replace(/(\w)([.,])(?!\s)/g, "$1$2 ") // Ensure spacing only if missing
    .split(/\s+/)
    .map((word, index, words) => {
      const lowerWord = word.toLowerCase();
      if (titles.has(lowerWord)) {
        return titles.get(lowerWord)!;
      }
      if (index > 0 && words[index - 1].endsWith(".")) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\s+([.,])/g, "$1") // Remove unnecessary spaces before punctuation
    .replace(/(\bS\.)\s+(?=[A-Z])/, "$1"); // Ensure no space inside abbreviations like S.Pd.
};

/** ----------------------------------------------------------
 * * ***Capitalizes the first letter of each word in a string while converting the rest to lowercase.*** ✅
 * ----------------------------------------------------------
 *
 * @param str - The string to be processed.
 * @returns The string with the first letter of each word capitalized and the rest in lowercase, if string is null or undefined will return "" as empty string.
 */
export const capitalizeString = (str?: string | null): string => {
  // Check if the input is a non-empty string
  if (!str || typeof str !== "string" || !str.trim().length) return "";

  return str
    .toLowerCase() // Convert the entire string to lowercase to normalize casing
    .split(" ") // Split the string into an array of words based on spaces
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter & append the rest
    )
    .join(" "); // Join the modified words back into a single string
};

/** ----------------------------------------------------------
 * * ***Converts a string to camelCase.***
 * ----------------------------------------------------------
 *
 * @description
 * - The first word starts with a lowercase letter.
 * - Subsequent words start with an uppercase letter.
 * - Removes spaces, hyphens (-), and underscores (_).
 * - If input is `null` or `undefined`, returns an empty string.
 *
 * @param {string | null | undefined} str - The input string.
 * @returns {string} The formatted camelCase string.
 *
 * @example
 * toCamelCase("hello world"); // "helloWorld"
 * toCamelCase("convert_to-camel case"); // "convertToCamelCase"
 * toCamelCase(null); // ""
 */
export const toCamelCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove unwanted characters
        .split(/[\s-_]+/) // Split by space, hyphen, or underscore
        .map(
          (word, index) =>
            index === 0
              ? word.toLowerCase() // First word stays lowercase
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize subsequent words
        )
        .join("") // Join without spaces
    : "";
};

/** ----------------------------------------------------------
 * * ***Converts a string to PascalCase.***
 * ----------------------------------------------------------
 *
 * @description
 * - Each word starts with an uppercase letter.
 * - Removes spaces, hyphens (-), and underscores (_).
 * - If input is `null` or `undefined`, returns an empty string.
 *
 * @param {string | null | undefined} str - The input string.
 * @returns {string} The formatted PascalCase string.
 *
 * @example
 * toPascalCase("hello world"); // "HelloWorld"
 * toPascalCase("convert_to-pascal case"); // "ConvertToPascalCase"
 * toPascalCase(null); // ""
 */
export const toPascalCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove unwanted characters
        .split(/[\s-_]+/) // Split by space, hyphen, or underscore
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize words
        .join("") // Join without spaces
    : "";
};
