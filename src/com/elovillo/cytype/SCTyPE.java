/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.elovillo.cytype;


import android.os.Bundle;

import org.apache.cordova.*;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.plugin.gcm.PushPlugin;


import android.app.Activity;
import android.util.Log;
import android.view.Menu;

public class SCTyPE extends CordovaActivity 
{

	private final static int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;

	@Override
	public void onCreate(Bundle savedInstanceState)
	{

		super.onCreate(savedInstanceState);
		super.init();
		super.setIntegerProperty("splashscreen", R.drawable.splash);
		//super.loadUrl("file:///android_asset/www/index.html", 10000);
		if (checkPlayServices()) {

			// Set by <content src="index.html" /> in config.xml
			super.loadUrl(Config.getStartUrl());
			//super.loadUrl("file:///android_asset/www/index.html")
			Bundle bndl=getIntent().getExtras();
			if(bndl!=null){
				if(bndl.containsKey("pushBundle"))
				{ handleGCMMessagesLaunch(bndl.getBundle("pushBundle"));}
			}
		}
	}

	protected void onResume() {
		super.onResume();
		checkPlayServices();
		Bundle bndl=getIntent().getExtras();
		if(bndl!=null){
			if(bndl.containsKey("pushBundle"))
			{ handleGCMMessagesLaunch(bndl.getBundle("pushBundle"));}
		}

 
	}
	private boolean checkPlayServices() {
		int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
		if (resultCode != ConnectionResult.SUCCESS) {
			if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
				GooglePlayServicesUtil.getErrorDialog(resultCode, this,
						PLAY_SERVICES_RESOLUTION_REQUEST).show();
			} else {
				Log.i(TAG, "This device is not supported.");
				finish();
			}
			return false;
		}
			return true;

	}
	private void handleGCMMessagesLaunch(Bundle SavedInstance){
		Log.d("MainActivity","inside MainActivityHandlerGCM");
		PushPlugin.sendExtras(SavedInstance);
	}   
}




