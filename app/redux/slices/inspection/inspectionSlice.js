import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addInspectionItem,
  addInspectionTemplateApi,
  fetchInspectionTemplatesApi,
  scheduleInspectionApi,
  fetchInspectionsByUserIdApi,
  fetchTemplateByTemplateIdApi,
  fetchInspectionItemsByIdsApi,
  uploadFileToFirebaseStorage,
  saveInspectionReportApi,
  fetchInspectionReportWithUserIdApi,
  fetchInspectionDetailsByIdsApi,
} from "./inspectionApi";
import { fetchInspectionItemsApi } from "./inspectionApi";

// ✅ Thunk to add a new inspection
export const addInspectionItemSlice = createAsyncThunk(
  "inspection/addInspectionItemSlice",
  async (inspectionData, { rejectWithValue }) => {
    try {
      const response = await addInspectionItem({ inspectionData });
      console.log("response", response).data;

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const addInspectionTemplateSlice = createAsyncThunk(
  "inspection/addInspectionTemplateSlice",
  async ({ inspectionTemplate }, { rejectWithValue }) => {
    try {
      const response = await addInspectionTemplateApi({ inspectionTemplate });
      console.log("response", response).data;

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchInspectionItems = createAsyncThunk(
  "inspection/fetchInspectionItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchInspectionItemsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchInspectionTemplatesSlice = createAsyncThunk(
  "inspection/fetchInspectionTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchInspectionTemplatesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const scheduleInspectionSlice = createAsyncThunk(
  "inspection/scheduleInspection",
  async (inspectionData, { rejectWithValue }) => {
    try {
      const response = await scheduleInspectionApi(inspectionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchInspectionsByUserIdSlice = createAsyncThunk(
  "inspection/fetchInspectionsByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchInspectionsByUserIdApi(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchTemplateByTemplateIdSlice = createAsyncThunk(
  "inspection/fetchTemplateByTemplateId",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await fetchTemplateByTemplateIdApi(templateId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchInspectionItemsByIdsSlice = createAsyncThunk(
  "inspection/fetchInspectionItemsByIdsSlice",
  async (inspectionItems, { rejectWithValue }) => {
    try {
      const response = await fetchInspectionItemsByIdsApi(inspectionItems);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const saveInspectionReportSlice = createAsyncThunk(
  "inspection/saveInspectionReport",
  async (
    { inspectionId, checklistItemsData, templateId, userId, propertyId },
    { rejectWithValue }
  ) => {
    try {
      const reportData = {};
      const itemProcessingPromises = [];

      for (const itemId in checklistItemsData) {
        itemProcessingPromises.push(async () => {
          const itemData = checklistItemsData[itemId];

          if (itemData.isSkipped) {
            reportData[itemId] = { skipped: true };
          } else {
            const itemReport = { ...itemData.data };
            const itemUploadPromises = [];
            const imageUrls = [];
            const videoUrls = [];

            // Handle image uploads
            if (itemReport.images && itemReport.images.length > 0) {
              itemReport.images.forEach((image, index) => {
                const storagePath = `inspection_reports/${inspectionId}/${itemId}/images/${index}_${image.fileName}`;
                itemUploadPromises.push(
                  uploadFileToFirebaseStorage(image.uri, storagePath).then(
                    (result) => {
                      if (result.success) {
                        imageUrls.push(result.url);
                      }
                    }
                  )
                );
              });
            }

            // Handle video uploads
            if (itemReport.videos && itemReport.videos.length > 0) {
              itemReport.videos.forEach((video, index) => {
                const storagePath = `inspection_reports/${inspectionId}/${itemId}/videos/${index}_${video.fileName}`;
                itemUploadPromises.push(
                  uploadFileToFirebaseStorage(video.uri, storagePath).then(
                    (result) => {
                      if (result.success) {
                        videoUrls.push(result.url); // Collect video URLs here
                      }
                    }
                  )
                );
              });
            }

            // Wait for uploads for this specific item
            await Promise.all(itemUploadPromises);

            // Assign collected URLs back to the item report
            itemReport.images = imageUrls;
            itemReport.videos = videoUrls; // Assign collected video URLs

            reportData[itemId] = itemReport;
          }
        });
      }

      // Wait for all items to be processed (including their uploads)
      await Promise.all(itemProcessingPromises.map((promise) => promise()));

      // Save the report data to Firestore
      const saveResult = await saveInspectionReportApi(
        inspectionId,
        {
          ...reportData,
        },
        templateId,
        userId,
        propertyId
      ); // Include templateId, userId, and propertyId at the top level

      if (!saveResult.success) {
        return rejectWithValue(
          saveResult.error || "Failed to save inspection report"
        );
      }

      return { success: true, inspectionId };
    } catch (error) {
      console.error("Error in saveInspectionReportSlice:", error);
      return rejectWithValue(
        error.message || "Something went wrong saving the report"
      );
    }
  }
);

export const fetchInspectionReportWithUserId = createAsyncThunk(
  "inspection/fetchInspectionReportWithUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchInspectionReportWithUserIdApi(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchInspectionDetailsByIds = createAsyncThunk(
  "inspection/fetchInspectionDetailsByIds",
  async (inspectionIds, { rejectWithValue }) => {
    try {
      const response = await fetchInspectionDetailsByIdsApi(inspectionIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const initialState = {
  inspectionItems: [],
  inspectionTemplates: [],
  userInspections: [],
  selectedTemplate: [],
  selectedItems: [],
  inspectionReports: [],
  selectedInspections: [],
  itemLoading: false,
  templateLoading: false,
  loading: false,
  scheduleLoading: false,
  fetchInspectionsLoading: false,
  error: null,
  successMessage: null,
};

const inspectionSlice = createSlice({
  name: "inspection",
  initialState,
  reducers: {
    clearInspectionState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addInspectionItemSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addInspectionItemSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.inspectionItems.push(action.payload);
        state.successMessage = "Inspection item added successfully";
      })
      .addCase(addInspectionItemSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInspectionItems.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchInspectionItems.fulfilled, (state, action) => {
        state.loading = false;
        state.inspectionItems = action.payload;
        state.successMessage = "Inspection item added successfully";
      })
      .addCase(fetchInspectionItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInspectionTemplatesSlice.pending, (state) => {
        state.templateLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchInspectionTemplatesSlice.fulfilled, (state, action) => {
        state.templateLoading = false;
        state.inspectionTemplates = action.payload;
        state.successMessage = "Inspection item added successfully";
      })
      .addCase(fetchInspectionTemplatesSlice.rejected, (state, action) => {
        state.templateLoading = false;
        state.error = action.payload;
      })
      .addCase(scheduleInspectionSlice.pending, (state) => {
        state.scheduleLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(scheduleInspectionSlice.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.successMessage = "Inspection scheduled successfully";
      })
      .addCase(scheduleInspectionSlice.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchInspectionsByUserIdSlice.pending, (state) => {
        state.fetchInspectionsLoading = true;
        state.error = null;
      })
      .addCase(fetchInspectionsByUserIdSlice.fulfilled, (state, action) => {
        state.fetchInspectionsLoading = false;
        state.userInspections = action.payload.data;
      })
      .addCase(fetchInspectionsByUserIdSlice.rejected, (state, action) => {
        state.fetchInspectionsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTemplateByTemplateIdSlice.pending, (state) => {
        state.templateLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchTemplateByTemplateIdSlice.fulfilled, (state, action) => {
        state.templateLoading = false;
        state.selectedTemplate = action.payload;
      })
      .addCase(fetchTemplateByTemplateIdSlice.rejected, (state, action) => {
        state.templateLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchInspectionItemsByIdsSlice.pending, (state) => {
        state.itemLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchInspectionItemsByIdsSlice.fulfilled, (state, action) => {
        state.itemLoading = false;
        state.selectedItems = action.payload;
      })
      .addCase(fetchInspectionItemsByIdsSlice.rejected, (state, action) => {
        state.itemLoading = false;
        state.error = action.payload;
      })
      .addCase(saveInspectionReportSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveInspectionReportSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = `Inspection report for ${action.payload.inspectionId} saved successfully`;
      })
      .addCase(saveInspectionReportSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInspectionReportWithUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInspectionReportWithUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.inspectionReports = action.payload;
      })
      .addCase(fetchInspectionReportWithUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInspectionDetailsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInspectionDetailsByIds.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInspections = action.payload;
      })
      .addCase(fetchInspectionDetailsByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInspectionState } = inspectionSlice.actions;
export default inspectionSlice.reducer;
