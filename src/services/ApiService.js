import { API_URL } from "../util/Config";
import axios from "axios";
import { handleError } from "../util/ErrorHandler";

const api = axios.create({
  baseURL: API_URL,
});

export function getEvaluationForInput(
  yTrue,
  yPred,
  metrics,
  metricType,
  rocAnalysis
) {
  let formData = new FormData();
  formData.append("y_true", yTrue);
  formData.append("y_pred", yPred);
  formData.append("metricType", metricType);
  metrics.forEach((item) => formData.append("metrics[]", item));
  if (rocAnalysis) {
    formData.append("roc", rocAnalysis);
  }

  const res = api
    .post(`/evaluate`, formData)
    .then((res) => res.data)
    .catch((err) => handleError(err));
  return res ? res : undefined;
}

export function getComparison(
  dataset,
  indices,
  yPred,
  classifiers,
  metrics,
  classifierSettings
) {
  let formData = new FormData();
  formData.append("dataset", dataset);
  if (yPred != null) {
    formData.append("y_pred", yPred);
  }
  if (indices != null) {
    formData.append("train_test_indices", indices);
  }
  metrics.forEach((item) => formData.append("metrics[]", item));
  classifiers.forEach((item) => formData.append("classifiers[]", item));

  for (let clf in classifierSettings) {
    for (let attr in classifierSettings[clf]) {
      formData.append(
        `classifier_settings.${clf}.${attr}`,
        classifierSettings[clf][attr]
      );
    }
  }

  const res = api
    .post(`/compare`, formData)
    .then((res) => res.data)
    .catch((err) => handleError(err));
  return res ? res : undefined;
}

export function getCVIndices(dataset) {
  let formData = new FormData();
  formData.append("dataset", dataset);

  const res = api
    .post(`/generateIndices`, formData)
    .then((res) => res)
    .catch((err) => handleError(err));
  return res ? res : undefined;
}
