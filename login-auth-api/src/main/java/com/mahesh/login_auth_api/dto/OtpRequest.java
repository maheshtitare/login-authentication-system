package com.mahesh.login_auth_api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpRequest {

    private String username;
    private String otp;

}