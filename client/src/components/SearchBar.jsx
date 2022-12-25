import React from "react";
import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="field has-addons">
      <div className="control is-expanded has-icons-left">
        <input
          className="input"
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <span className="icon is-large is-left">
          <IonIcon icon={searchOutline} size='small'/>
        </span>
      </div>
    </div>
  );
}
