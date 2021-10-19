const url = 'https://www.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=true';
document.addEventListener('DOMContentLoaded', function () {
	Table.show();
}, false);

const Table = {
	data: null,
	tabHeader: null,

	show: (filter = false) => {
		// Use cache memory instead of repeating ajax request
		if (Table.data) {
			return Table.setTableBody(Table.data, Table.tabHeader, filter);
		}

		// Requests data and displays it
		// fetch(url).then(res => res.json()).then(response => {
		$.get(url).done(response => {
			// Displays data in table
			const tabHeader = Table.setTableHeader(response[0]);
			Table.setTableBody(response, tabHeader, filter);
			Table.setFilters(response);

			// Saves cache memory
			Table.data = response;
			Table.tabHeader = tabHeader;
		});
	},

	setTableHeader: (header) => {
		// Columns to show
		const listFields = ['County', 'Name', 'AcresBurned', 'PercentContained', 'IsActive'];
		const keys = Object.keys(header);

		// Keep columns that are both in listField and header-keys
		return listFields.filter(key => keys.includes(key));
	},

	setFilters(results) {
		// Start with "All" filter (so no-filter)
		let counties = ['All'];

		// Loop over each result...
		results.forEach(function(currentValue) {
			 // and pushes the county into filter if county is not already there
			if (!counties.includes(currentValue.County)) {
				counties.push(currentValue.County);
			}
		});

		// Generate a list of <option>s to complete the filter select
		const options = counties.map(county => `<option>${county}</option>`).join('')

		// Update filter/select HTML
		Table.setValue('countyfilter', options);
	},

	setTableBody: (body, tabHeader, filter = '') => {
		// Start creating table HTML
		let content = `<table class="table table-striped table-bordered table-hover"><thead><tr>`;

		// Create header
		tabHeader.forEach(function(currentValue) {
			content += `<th>${currentValue}</th>`;
		});

		// Close header and start table body
		content += `</tr></thead><tbody>`;

		// Filter results to show
		const filtered = body
			.filter(row => (!filter || filter === 'All' || (row.County == filter)));

		// Show all filtered results
		filtered.forEach((currentValue) => {
			content += `<tr>`;
			tabHeader.forEach(key => content += `<td>${currentValue[key]}</td>`);
			content += `</tr>`;
		});

		// Close body and table. Then display table content
		content += `</tbody></table>`;
		Table.setValue('table__body', content);
	},

	setValue: (id, content) => {
		document.getElementById(id).innerHTML = content;
	},

	search: (value) => {
		Table.show(value);
	},
};

// Tests
/*
Table.setValue('table__body', 'content...')
console.assert(document.getElementById('table__body').innerHTML === 'invalid content...', 'Table.setValue is broken!');

const tableHeader = Table.setTableHeader({ 'County': '...', 'Name': '...', 'AcresBurned': '...', 'PercentContained': '...', 'IsActive': '...' });
const expectedTableHeader = ['County', 'Name', 'AcresBurned', 'PercentContained', 'IsActive'];
console.assert(tableHeader.toString() == expectedTableHeader.toString(), 'setTableHeader failed');
*/