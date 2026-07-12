package com.mahesh.login_auth_api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    private String username;
    private String newPassword;

}