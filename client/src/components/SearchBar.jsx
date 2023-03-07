import React from "react";
import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';

export default function SearchBar({ searchTerm, setSearchTerm }) {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="field has-addons">
      <div className="control is-expanded has-icons-left">
        <input
          id="searchInput"
          className="input"
          type="text"
          placeholder="Search for any movie by title"
          value={searchTerm}
          onChange={handleInputChange}
          aria-label="Search for any movie by title"
        />
        <span className="icon is-large is-left" aria-hidden="true">
          <IonIcon icon={searchOutline} size='small' aria-label="Search icon" />
        </span>
      </div>
    </div>
  );
}

