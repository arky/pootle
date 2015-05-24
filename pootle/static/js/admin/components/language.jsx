/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

'use strict';

var React = require('react');

var Search = require('./search');
var models = require('models/language');

import LanguageForm from './LanguageForm';


var LanguagesAdmin = React.createClass({

  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    onSelectItem: React.PropTypes.func.isRequired,
    onSuccess: React.PropTypes.func.isRequired,
    searchQuery: React.PropTypes.string.isRequired,
    selectedItem: React.PropTypes.object,
  },

  render: function () {
    var viewsMap = {
      add: <LanguageAdd
              model={this.props.model}
              collection={this.props.items}
              onSuccess={this.props.onSuccess}
              onCancel={this.props.onCancel} />,
      edit: <LanguageEdit
              model={this.props.selectedItem}
              collection={this.props.items}
              onAdd={this.props.onAdd}
              onSuccess={this.props.onSuccess}
              onDelete={this.props.onDelete} />
    };

    var args = {
      count: this.props.items.count,
    }, msg;

    if (this.props.searchQuery) {
      msg = ngettext('%(count)s language matches your query.',
                     '%(count)s languages match your query.', args.count);
    } else {
      msg = ngettext(
        'There is %(count)s language.',
        'There are %(count)s languages. Below are the most recently added ones.',
        args.count
      );
    }
    var resultsCaption = interpolate(msg, args, true);

    var fields = ['index', 'code', 'fullname'];

    return (
      <div className="admin-app-languages">
        <div className="module first">
          <Search
            fields={fields}
            onSearch={this.props.onSearch}
            onSelectItem={this.props.onSelectItem}
            items={this.props.items}
            selectedItem={this.props.selectedItem}
            searchLabel={gettext('Search Languages')}
            searchPlaceholder={gettext('Find language by name, code')}
            resultsCaption={resultsCaption}
            searchQuery={this.props.searchQuery} />
        </div>

        <div className="module admin-content">
          {viewsMap[this.props.view]}
        </div>
      </div>
    );
  }

});


var LanguageAdd = React.createClass({

  propTypes: {
    onCancel: React.PropTypes.func.isRequired,
    onSuccess: React.PropTypes.func.isRequired,
  },

  /* Layout */

  render: function () {
    return (
      <div className="item-add">
        <div className="hd">
          <h2>{gettext('Add Language')}</h2>
          <button
            onClick={this.props.onCancel}
            className="btn btn-primary">{gettext('Cancel')}</button>
        </div>
        <div className="bd">
          <LanguageForm
            model={new this.props.model()}
            collection={this.props.collection}
            onSuccess={this.props.onSuccess} />
        </div>
      </div>
    );
  }

});


var LanguageEdit = React.createClass({

  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onSuccess: React.PropTypes.func.isRequired,
  },

  /* Layout */

  render: function () {
    return (
      <div className="item-edit">
        <div className="hd">
          <h2>{gettext('Edit Language')}</h2>
          <button
            onClick={this.props.onAdd}
            className="btn btn-primary">{gettext('Add Language')}</button>
        </div>
        <div className="bd">
        {!this.props.model ?
          <p>{gettext('Use the search form to find the language, then click on a language to edit.')}</p> :
          <LanguageForm
            key={this.props.model.id}
            model={this.props.model}
            collection={this.props.collection}
            onSuccess={this.props.onSuccess}
            onDelete={this.props.onDelete} />
        }
        </div>
      </div>
    );
  }

});


module.exports = {
  App: LanguagesAdmin,
  model: models.Language,
  collection: models.LanguageSet,
};
