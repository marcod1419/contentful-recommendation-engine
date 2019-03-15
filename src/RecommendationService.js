import { get, countBy, flatMap, random } from "lodash";

const RECOMMENDED_CT = "blockRow";
const REFERENCER_CT = "genericPageTemplate";
const REFERENCE_FIELD_ID = "blocks";
const DEFAULT_LOCALE = "en-CA";

export default function createRecService(sdk) {
  const getCurrentFieldValue = () => {
    return sdk.field.getValue();
  };
  const getReferenceFieldValue = entry => {
    return get(entry, ["fields", REFERENCE_FIELD_ID, DEFAULT_LOCALE], []);
  };
  const getEntries = content_type => {
    return sdk.space.getEntries({
      content_type
    });
  };
  const getReferencedEntries = (ids = []) => {
    return sdk.space.getEntries({
      "sys.id[in]": ids.join(",")
    });
  };

  const getPages = () => getEntries(REFERENCER_CT);
  const getBlocks = () => getEntries(RECOMMENDED_CT);
  const byRelevance = (a, b) => a.relevance - b.relevance;

  const getMockedRecommendations = async () => {
    const blocks = await getBlocks();

    return blocks.items
      .map(block => ({
        relevance: random(10, 100),
        entry: block
      }))
      .sort(byRelevance)
      .reverse();
  };

  async function getRecommendations(type = "") {
    // the value of the entry reference field we're editing
    const fieldValue = getCurrentFieldValue();
    // all entries of the recommended Content Type (right now it's only fetching 100 max)
    const allEntries = await getEntries();
    // a flat list of all entry references
    const allReferences = flatMap(allEntries.items, getReferenceFieldValue);
    // counts how many times each entry was referenced
    const byOccurrence = countBy(allReferences, "sys.id");
    console.log(byOccurrence);
  }

  return {
    getMockedRecommendations,
    getRecommendations,
    getReferencedEntries
  };
}
