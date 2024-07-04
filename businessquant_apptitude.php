<?php
/**
 * Plugin Name: BusinessQuant_Apptitude
 * Description: A plugin to filter and display data from a CSV file using DataTables and select2 Features.
 * Version: 1.0
 * Author: Sahil Sachin Deshmukh
 * Contact information: 
 * Phone Number: 7709393222
 * Email ID: Sahildeshmukh.3008@gmail.com
 * Linkedin Profile: https://linkedin.com/in/sahil3008
 * Github: https://github.com/Sahill3008 
 * College Name: Student at SNJB's Late Sau. Kantabai Bhavarlalji Jain College of Engineering Nashik
 * University Name: Savitribai phule Pune University(SPPU)
 * Graduation Program : BE Computer Engineering
 * Academic Year : 4th Year 
 * Working Hours: 6 -  8hrs per day (As per requirement of the company beacuse I want to gain experience about how the company funtions and the role requirements the company expects from the developers)
 */

add_action('admin_menu', 'businessquant_apptitude_menu');
add_action('admin_enqueue_scripts', 'businessquant_apptitude_enqueue_scripts');
add_shortcode('businessquant_apptitude', 'businessquant_apptitude_shortcode');

function businessquant_apptitude_menu() {
    add_menu_page('BusinessQuant_Apptitude', 'CSV Filter', 'manage_options', 'businessquant_apptitude', 'businessquant_apptitude_page');
}

function businessquant_apptitude_page() {
    ?>
    <div class="wrap">
        <div id="businessquant-apptitude-header">BusinessQuant_Apptitude</div>
        <div id="csv-filter-controls"></div>
        <div id="csv-data"></div>
    </div>
    <?php
}

function businessquant_apptitude_enqueue_scripts($hook) {
    if ($hook != 'toplevel_page_businessquant_apptitude') {
        return;
    }
    wp_enqueue_script('select2', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js', ['jquery'], null, true);
    wp_enqueue_style('select2', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css', [], null);
    wp_enqueue_script('datatables', 'https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js', ['jquery'], null, true);
    wp_enqueue_style('datatables', 'https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css', [], null);
    wp_enqueue_script('businessquant_apptitude_js', plugin_dir_url(__FILE__) . 'businessquant_apptitude.js', ['jquery', 'select2', 'datatables'], null, true);
    wp_enqueue_style('businessquant_apptitude_css', plugin_dir_url(__FILE__) . 'businessquant_apptitude.css', [], null);
    wp_localize_script('businessquant_apptitude_js', 'businessquant_apptitude_data', ['csv_data' => businessquant_apptitude_get_data()]);
}

function businessquant_apptitude_get_data() {
    $file = plugin_dir_path(__FILE__) . 'Sample-Data-Screener.csv';
    $csv_data = array_map('str_getcsv', file($file));
    return $csv_data;
}

function businessquant_apptitude_shortcode() {
    ob_start();
    ?>
    <div id="businessquant-apptitude-header">BusinessQuant_Apptitude</div>
    <div id="csv-filter-controls"></div>
    <div id="csv-data"></div>
    <?php
    return ob_get_clean();
}
?>