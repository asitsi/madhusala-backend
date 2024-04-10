import axios from "axios";
import http from "../http-common";
import moment from "moment";

import IAssessmentData from "../types/assessment.type";

class AssessmentDataService {
  getAll() {
    return http.get<Array<IAssessmentData>>("/assessments");
  }

  get(id: string) {
    return http.get<IAssessmentData>(`/assessments/${id}`);
  }

  create(data: IAssessmentData) {
    return http.post<IAssessmentData>("/assessments", data);
  }

  update(data: IAssessmentData, id: any) {
    return http.patch<any>(`/assessments/${id}`, data);
  }

  delete(id: any) {
    return http.delete<any>(`/assessments/${id}`);
  }

  login(data: any) {
    return http.post("/login", data);
  }

  getToken(data: any) {
    return axios.post(
      "https://app.cognocart.com/campaign/external/get-auth-token/",
      data
    );
  }

  convertTimeStringToDate(timeString:any) {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    const date = new Date();
    date.setHours(hours + (period === 'PM' ? 12 : 0));
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date;
  }
  
  createCampaign(token: any, message: any, time: any = null) {
    let dateTime
    if(time == null){
      dateTime = moment(new Date()).format("_YYYY-MM-DD_HH:mm:ss");
    }else{
      let istString = this.convertTimeStringToDate(time)
      
      dateTime = moment(`${istString}`).format("_YYYY-MM-DD_HH:mm:ss");
    }
    return axios.post(
      "https://app.cognocart.com/campaign/external/create-campaign-external/",
      {
        authorization: token,
        campaign_name: `${message}${dateTime}`,
        channel_id: "1",
        template_variables: {
          type: "Text",
          language: "English (en)",
          template_name: message,
          category: "ALERT_UPDATE",
          button_type: "None",
        },
      }
    );
  }

  sendCampaignMessage(
    token: any,
    clientData: any,
    campaignId: any,
    campaignName: any) {
    const nonDuplicateClientData = Object.values(clientData.reduce((acc: any,cur: { phone_number: any; })=>Object.assign(acc,{[cur.phone_number]:cur}),{}))

    return axios.post(
      "https://app.cognocart.com/campaign/external/send-campaign-message-external/",
      {
        authorization: token,
        campaign_id: campaignId,
        batch_name: `${campaignName}`,
        auto_delete_invalid_number: false,
        whatsapp_bsp: "1",
        client_data: nonDuplicateClientData,
      }
    );
  }
}

export default new AssessmentDataService();
