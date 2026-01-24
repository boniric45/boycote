<?php

   error_reporting(E_ALL);   // Activer le rapport d'erreurs PHP

   // A partir de PHP 5.6, sinon les caractères accentués seront mal affichés

   ini_set('default_charset', 'iso8859-1');

function getmicrotime()

   {

   list($usec, $sec) = explode(" ",microtime());

   return ((float)$usec + (float)$sec);

   }
 
   $Date_start = getmicrotime();
 

// ******  Exemples de configuration selon les hébergements mutualisés ******

//      $DBhost  = "<Nom_de_la_Base>.mysql.db";

//      $DBowner = "<Nom_de_la_Base>";  // Ton login SQL

//      $DBName  = $DBowner;


// ******  Fin des exemples de configuration


// ******  Configuration - Debut ******

   $DBhost  = "xnboycnboycote.mysql.db";   // Par exemple

   $DBowner = "xnboycnboycote";  // ton login SQL

   $DBpw    = "Preventiel2135";  // ton password SQL

   $DBName  = $DBowner;

// ******  Configuration - Fin ******

?>