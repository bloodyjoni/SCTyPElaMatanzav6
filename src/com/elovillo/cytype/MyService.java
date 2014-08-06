package com.elovillo.cytype;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;


import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.telephony.TelephonyManager;
import android.util.Log;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

import android.util.Log;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

public class MyService extends BackgroundService {
private String mHelloTo = "World";
	final String EXTRA_MESSAGE = "message";
	final String PROPERTY_REG_ID = "registration_id";

	final String PROPERTY_APP_VERSION = "appVersion";
	final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
	GoogleCloudMessaging gcm ;
	String regid ="";
	/**
	 * Substitute you own sender ID here. This is the project number you got
	 * from the API Console, as described in "Getting Started."
	 */
	String SENDER_ID = "903631975028";//cambiado por el de colectivo cientifico
	String ADD_TOKEN_SCRIPT ="http://www.proyectored.com.ar/mobile/GCMServ/addtoken.php?uuid=";
	String DELETE_TOKEN_SCRIPT =  "http://www.proyectored.com.ar/mobile/GCMServ/deletetoken.php?token=";
	/**
	 * Tag used on log messages.
	 */
	static final String TAG = "GCMREGISTRATION";
	@Override
	// Add wait for network

	protected JSONObject doWork() {



		JSONObject result = new JSONObject();

		registerBackground();






		// connection part


		SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss"); 
		String now = df.format(new Date(System.currentTimeMillis())); 

		String msg = "Hello " + this.mHelloTo + " - its currently " + now ;
		try {
			result.put("Message", msg);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Log.d("msg", msg);

		return result;

	}
	/*
	 *  addTokenScript : "http://www.proyectored.com.ar/mobile/addtoken.php?token=",
		 deleteTokenScript  : "http://www.proyectored.com.ar/mobile/deletetoken.php?token=",
		 senderID : "447745035223",
	 */
	public void onCreate()
	{ 
		super.onCreate();
		JSONObject config=new JSONObject();
		try {
			config.put("deleteTokenScript",DELETE_TOKEN_SCRIPT);
			config.put("senderID",SENDER_ID);
			config.put("addTokenScript",ADD_TOKEN_SCRIPT);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		setConfig(config);
		super.runOnce();

	}


	protected void setConfig(JSONObject config) {
		//mofifier pour la prise en chage de mon JSON
		try {
			if (config.has("addTokenScript"))
				this.ADD_TOKEN_SCRIPT = config.getString("addTokenScript");
			if (config.has("deleteTokenScript"))
				this.DELETE_TOKEN_SCRIPT = config.getString("deleteTokenScript");
			if (config.has("senderID"))
				this.SENDER_ID = config.getString("senderID");

		} catch (Exception e) {
			Log.d(TAG,"Set Config Error"+ e.toString());
		}
		// launch the service

		//doWork();

	}     


	@Override
	protected JSONObject initialiseLatestResult() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected void onTimerEnabled() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void onTimerDisabled() {


	}


	@Override
	protected JSONObject getConfig() {
		JSONObject result = new JSONObject();

		try {
			result.put("HelloTo", this.mHelloTo);
		} catch (JSONException e) {
		}

		return result;
	}
	
	private void registerBackground() {
		new AsyncTask<Object, Object, Object>() {
			@Override
			protected String doInBackground(Object... arg0) {
				String msg = "";
				try {
					if (gcm == null) {
						//gcm = GoogleCloudMessaging.getInstance(ApplicationContext.getContext());
						if(gcm == null){
						gcm=com.google.android.gms.gcm.GoogleCloudMessaging.getInstance(getApplicationContext());
						
					}
						regid=gcm.register(SENDER_ID);
					}
				
					msg = "Device registered registration id=" + regid;
				} catch(IOException e){
					Log.d("Background Registration","gcm.registererror");

				}

				//Gerenating UUID
				TelephonyManager tm= (TelephonyManager) getApplicationContext().getSystemService(TELEPHONY_SERVICE);
				String uuid= tm.getDeviceId();
				URL url = null;
				try {
					url = new URL(ADD_TOKEN_SCRIPT+uuid+"&token="+regid);
				} catch (MalformedURLException e) {
					// TODO Auto-generated catch block
					Log.d(TAG,"InvalidURL");
					e.printStackTrace();
				}
				HttpURLConnection urlConnection = null;
				try {
					urlConnection = (HttpURLConnection) url.openConnection();

					InputStream in = new BufferedInputStream(urlConnection.getInputStream());
					InputStreamReader reader= new InputStreamReader(in);
					Log.d("urlconnection return",reader.toString());
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				finally {
					urlConnection.disconnect();
					// Save the regid - no need to register again.

				}

				onPostExecute(msg);
				return msg;

			}

			protected void onPostExecute(String msg) {
				Log.d("background Registration",msg + "\n");
				//passing regid to Broadcast receiver
				SharedPreferences shrprfs= getSharedPreferences("SERVPUSH_PREFS", 0);
				SharedPreferences.Editor edit= shrprfs.edit();
				edit.putString("Regid", regid);
				edit.commit();

			}


		}.execute(null, null, null);
	}
}


