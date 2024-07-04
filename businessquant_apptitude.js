jQuery(document).ready(function ($) {
    var csvData = businessquant_apptitude_data.csv_data;

    function displayCSVData(data) {
        var table = '<table id="csv-table" class="display"><thead><tr>';
        data[0].forEach(function (header) {
            table += '<th>' + header + '</th>';
        });
        table += '</tr></thead><tbody>';
        data.slice(1).forEach(function (row) {
            table += '<tr>';
            row.forEach(function (cell) {
                table += '<td>' + cell + '</td>';
            });
            table += '</tr>';
        });
        table += '</tbody></table>';
        $('#csv-data').html(table);
        $('#csv-table').DataTable();
    }
    function addFilterControls() {
    var controls = '<form id="csv-filter-form" class="form-inline">';
    controls += '<div id="filter-group" class="form-group">' + getFilterControl(0) + '</div>';
    controls += '<div id="button-group">';
    controls += '<button type="button" id="add-filter" class="add-filter"><span class="button_top">Add Filter</span></button>';
    controls += '</div>';
    controls += '<div id="filter-button-group">';
    controls += '<input type="submit" value="Filter" class="button-primary">';
    controls += '</div>';
    controls += '</form>';
    $('#csv-filter-controls').html(controls);
    $('.csv-column-select').select2();
    $('.csv-operator-select').select2();
    $('.csv-unit-select').select2();
}

    function getFilterControl(index) {
        var control = '<div class="filter-item" data-filter-index="' + index + '">';
        control += '<label for="metric-select-' + index + '">Metric:</label>';
        control += '<select id="metric-select-' + index + '" data-filter-index="' + index + '" class="csv-column-select">';
        control += '<option value="">Select Metric</option>';
        csvData[0].forEach(function (header, idx) {
            control += '<option value="' + idx + '">' + header + '</option>';
        });
        control += '</select>';
        control += '<label for="operator-select-' + index + '">Filter:</label>';
        control += '<select id="operator-select-' + index + '" data-filter-index="' + index + '" class="csv-operator-select">';
        control += '<option value="">Select Operator</option>';
        control += '<option value="equals">Equals</option>';
        control += '<option value="not_equals">Not Equals</option>';
        control += '<option value="greater_than">Greater Than</option>';
        control += '<option value="less_than">Less Than</option>';
        control += '<option value="greater_than_or_equal">Greater Than or Equal</option>';
        control += '<option value="less_than_or_equal">Less Than or Equal</option>';
        control += '</select>';
        control += '<label for="value-input-' + index + '">Value:</label>';
        control += '<input id="value-input-' + index + '" type="text" data-filter-index="' + index + '" class="csv-value-input" />';
        control += '<label for="unit-select-' + index + '">Unit:</label>';
        control += '<select id="unit-select-' + index + '" data-filter-index="' + index + '" class="csv-unit-select">';
        control += '<option value="">Select Unit</option>';
        control += '<option value="one">Ones</option>';
        control += '<option value="thousand">Thousands</option>';
        control += '<option value="million">Millions</option>';
        control += '<option value="billion">Billions</option>';
        control += '</select>';
        control += '<button type="button" class="btn" data-filter-index="' + index + '">';
        control += '<svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon"><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zzm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg>';
        control += '</button>';
        control += '</div>';
        return control;
    }

    $('#csv-filter-controls').on('click', '#add-filter', function () {
        var index = $('#filter-group .filter-item').length;
        $('#filter-group').append(getFilterControl(index));
        $('.csv-column-select').select2();
        $('.csv-operator-select').select2();
        $('.csv-unit-select').select2();
    });

    $('#csv-filter-controls').on('click', '.btn', function () {
        var filterIndex = $(this).data('filter-index');
        $(this).closest('.filter-item').remove();
        $('#filter-group .filter-item').each(function (index) {
            $(this).attr('data-filter-index', index);
            $(this).find('.csv-column-select').attr('data-filter-index', index);
            $(this).find('.csv-operator-select').attr('data-filter-index', index);
            $(this).find('.csv-value-input').attr('data-filter-index', index);
            $(this).find('.csv-unit-select').attr('data-filter-index', index);
            $(this).find('.btn').attr('data-filter-index', index);
        });
    });

    $('#csv-filter-controls').on('submit', '#csv-filter-form', function (event) {
        event.preventDefault();
        var filters = [];
        $('#filter-group .filter-item').each(function () {
            var filterIndex = $(this).data('filter-index');
            var metric = $('#metric-select-' + filterIndex).val();
            var operator = $('#operator-select-' + filterIndex).val();
            var value = $('#value-input-' + filterIndex).val();
            var unit = $('#unit-select-' + filterIndex).val();
            if (metric && operator && value) {
                filters.push({
                    metric: metric,
                    operator: operator,
                    value: value,
                    unit: unit
                });
            }
        });
        var filteredData = applyFilters(csvData, filters);
        displayCSVData(filteredData);
    });

    function applyFilters(data, filters) {
        var headers = data[0];
        var rows = data.slice(1);
        filters.forEach(function (filter) {
            rows = rows.filter(function (row) {
                var value = parseFloat(row[filter.metric]);
                var filterValue = parseFloat(filter.value);
                if (filter.unit === 'thousand') {
                    value /= 1000;
                } else if (filter.unit === 'million') {
                    value /= 1000000;
                } else if (filter.unit === 'billion') {
                    value /= 1000000000;
                }
                switch (filter.operator) {
                    case 'equals':
                        return value === filterValue;
                    case 'not_equals':
                        return value !== filterValue;
                    case 'greater_than':
                        return value > filterValue;
                    case 'less_than':
                        return value < filterValue;
                    case 'greater_than_or_equal':
                        return value >= filterValue;
                    case 'less_than_or_equal':
                        return value <= filterValue;
                    default:
                        return true;
                }
            });
        });
        return [headers].concat(rows);
    }

    addFilterControls();
    displayCSVData(csvData);
});