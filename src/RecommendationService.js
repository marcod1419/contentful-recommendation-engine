import { get, difference, intersection, flatMap, random, uniqBy } from "lodash";

const RECOMMENDED_CT = "blockRow";
const REFERENCER_CT = "genericPageTemplate";
const REFERENCE_FIELD_ID = "blocks";
const DEFAULT_LOCALE = "en-CA";

export default function createRecService(sdk) {
  const getCurrentFieldValue = () => {
    return sdk.field.getValue() || [];
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
  const getUnique = entries => uniqBy(entries, "sys.id");
  const getIds = entries => entries.map(entry => entry.sys.id);
  const generateRelevancePercentages = (recs = []) => {
    const highestScore = recs[0].relevance;
    if (!recs.length) return [];

    return recs.map(rec => ({
      entry: rec.entry,
      relevance: Math.floor((rec.relevance * 100) / highestScore)
    }));
  };
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

  const getPopularBlocks = async () => {
    // all blocks (currently max of 100)
    const { items: allBlocks } = await getBlocks();
    // all entries of the recommended Content Type (currently 100 max)
    const allEntries = await getPages();
    // a flat list of all entry references
    const allReferences = flatMap(allEntries.items, getReferenceFieldValue);
    const withScores = allReferences.reduce((memo, entry) => {
      const id = entry.sys.id;
      if (!memo[id]) memo[id] = { entry: id, relevance: 0 };
      memo[id].relevance++;
      return memo;
    }, {});

    // todo: make diff work
    // we want to show also the blocks that have never been referenced before
    // const diff = allBlocks.reduce((memo, entry) => {
    //   const id = entry.sys.id;
    //   const isReferenced = allReferences.some(ref => ref.sys.id === id);
    //   if (isReferenced) return;
    //   memo[id] = { entry, relevance: 0 };
    //   return memo;
    // }, {});

    return generateRelevancePercentages(
      Object.values(withScores)
        .sort(byRelevance)
        .reverse()
    );
  };

  async function getRecommendations() {
    // the value of the entry reference field we're editing
    const fieldValue = getCurrentFieldValue();
    const valueIds = getIds(fieldValue);
    // all entries of the recommended Content Type (currently 100 max)
    const allEntries = await getPages();
    const recommendations = allEntries.items
      .reduce((memo, entry) => {
        const referenceIds = getIds(getReferenceFieldValue(entry));
        const diff = difference(referenceIds, valueIds);
        const relevance = intersection(valueIds, referenceIds).length;
        const recommended = diff.map(block => ({ entry: block, relevance }));
        return [...memo, ...recommended];
      }, [])
      .reduce((memo, rec) => {
        const id = rec.entry;
        if (!memo[id]) memo[id] = { entry: rec.entry, relevance: 0 };
        memo[id].relevance += rec.relevance;
        return memo;
      }, {});

    return generateRelevancePercentages(
      Object.values(recommendations)
        .sort(byRelevance)
        .reverse()
    );
  }

  return {
    getMockedRecommendations,
    getRecommendations,
    getReferencedEntries,
    getPopularBlocks
  };
}
