
<style scoped>
@import "../assets/style.css";

.community-recipes {
  padding: 20px;
  max-width: 1200px;
  margin: 0;
} */

.main-card-items {
  align-items: start;
}

input[type="text"] {
  flex: 1;
  min-width: 250px;
}





.loading,
.no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* .filters {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
} */

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 15px;
  }

  .search-bar {
    width: 100%;
    order: -1; /* Makes search bar appear first */
  }

  .filter-options,
  .sort-options {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .sort-options {
    padding: 12px;
  }

  .radio-group {
    width: 100%;
  }

  .radio-label {
    width: 100%;
    padding: 8px 0;
  }

  .filter-options select.rating-filter {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    font-size: 16px; /* Better for mobile tap targets */
  }

  .sort-label {
    margin-bottom: 12px;
    font-size: 16px;
  }

  .radio-text {
    font-size: 16px;
  }

  /* Ensure proper spacing between radio options */
  .radio-group {
    gap: 12px;
  }
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  line-height: normal;
  box-sizing: border-box;
}

.filter-options select.rating-filter {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  line-height: normal;
  margin: 0;
}

.rating-filter {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.sort-options {
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
}

.sort-options label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.recipe-card {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 25px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipe-info {
  margin: 10px 0;
}

.recipe-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #5e9b77;
  color: #e6e6e6;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #4b8063;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.close {
  float: right;
  cursor: pointer;
  font-size: 24px;
}

.review-section {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.rating-input {
  margin-bottom: 10px;
}

.rating-input select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  box-sizing: border-box;
}

.review-buttons {
  display: flex;
  gap: 10px;
}

.reviews-section {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.toggle-reviews {
  background: none;
  border: none;
  color: #4caf50;
  cursor: pointer;
  padding: 5px 0;
  font-weight: bold;
}

.reviews-list {
  margin-top: 10px;
}

.review-item {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.review-author {
  font-weight: bold;
}

.review-date {
  color: #666;
  font-size: 0.9em;
}

.review-description {
  margin: 5px 0 0;
  color: #333;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

.rating {
  display: flex;
  gap: 5px;
  align-items: center;
}

.rating .fa-star.checked {
  color: gold;
}

.rating .fa-star-half-o.checked {
  color: gold;
}

.rating .fa-star {
  color: lightgray;
}

.sort-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 0;
}

.radio-text {
  color: #444;
}

input[type='radio'] {
  margin: 0;
  cursor: pointer;
}

.fav-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
