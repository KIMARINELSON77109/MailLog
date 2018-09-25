<?php
    require "sanitize.php";
    
    $LoginName = check_input($_POST["LoginName"]);
    $LoginPwd = check_input($_POST["LoginPwd"]);
    
    $ldap_dn = "uid=".$LoginName.",dc=example,dc=com";
    $ldap_password = $LoginPwd;
	
	$ldap_con = ldap_connect("ldap.forumsys.com");
	ldap_set_option($ldap_con, LDAP_OPT_PROTOCOL_VERSION, 3);

	if(ldap_bind($ldap_con,$ldap_dn,$ldap_password))
		echo "Authenticated";
	else
		echo "Invalid Credential";
?>