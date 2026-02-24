package org.example.skillandyou.controller;

import org.example.skillandyou.dto.UpdateUserDTO;
import org.example.skillandyou.dto.UserSearchDTO;
import org.example.skillandyou.security.SecurityConfig;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;
import org.example.skillandyou.dto.RegisterRequestDTO;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.security.JwtAuthFilter;
import org.example.skillandyou.security.JwtUtil;
import org.example.skillandyou.security.suspensionCheckFilter;
import org.example.skillandyou.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = { UserController.class, GlobalExceptionHandler.class },
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class
        },
        excludeFilters = {
                @ComponentScan.Filter(
                        type = FilterType.ASSIGNABLE_TYPE,
                        classes = {
                                SecurityConfig.class,
                                JwtAuthFilter.class,
                                suspensionCheckFilter.class
                        }
                )
        }
)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = JsonMapper.builder().build();

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @Test
    void register_nominal_shouldReturn201() throws Exception {
        RegisterRequestDTO req = new RegisterRequestDTO(
                "daniel@example.com", "danielC", "Daniel", "C", "Password1!"
        );
        User createdUser = User.builder()
                .id(1L).email("daniel@example.com").userName("danielC")
                .firstName("Daniel").lastName("C").build();

        when(userService.createUser(any(User.class))).thenReturn(createdUser);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("daniel@example.com"))
                .andExpect(jsonPath("$.userName").value("danielC"));
    }

    @Test
    void register_emailAlreadyExists_shouldReturn400() throws Exception {
        RegisterRequestDTO req = new RegisterRequestDTO(
                "daniel@example.com", "danielC", "Daniel", "C", "Password1!"
        );
        when(userService.createUser(any(User.class)))
                .thenThrow(new IllegalArgumentException("EMAIL_ALREADY_EXISTS"));

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("EMAIL_ALREADY_EXISTS"));
    }

    @Test
    void register_invalidEmail_shouldReturn400() throws Exception {
        RegisterRequestDTO req = new RegisterRequestDTO(
                "pas-un-email", "danielC", "Daniel", "C", "Password1!"
        );
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_weakPassword_shouldReturn400() throws Exception {
        RegisterRequestDTO req = new RegisterRequestDTO(
                "daniel@example.com", "danielC", "Daniel", "C", "weakpass"
        );
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }


    @Test
    void deleteAccount_nominal_shouldReturn204() throws Exception {

        doNothing().when(userService).deleteAccount(1L, "Password1!");


        mockMvc.perform(delete("/api/users/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\":\"Password1!\"}"))
                .andExpect(status().isNoContent()); // 204
    }

    @Test
    void deleteAccount_wrongPassword_shouldReturn400() throws Exception {

        doThrow(new IllegalArgumentException("INVALID_PASSWORD"))
                .when(userService).deleteAccount(1L, "mauvaismdp");


        mockMvc.perform(delete("/api/users/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\":\"mauvaismdp\"}"))
                .andExpect(status().isBadRequest()); // 400
    }

    @Test
    void deleteAccount_userNotFound_shouldReturn404() throws Exception {
        doThrow(new NoSuchElementException())
                .when(userService).deleteAccount(anyLong(), anyString());

        mockMvc.perform(delete("/api/users/users/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\":\"Password1!\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("NOT_FOUND"));
    }


    @Test
    void getAll_withUsers_shouldReturn200() throws Exception {

        List<User> users = List.of(
                User.builder().id(1L).email("daniel@example.com").userName("danielC").build(),
                User.builder().id(2L).email("alice@example.com").userName("aliceA").build()
        );
        when(userService.getAllUsers()).thenReturn(users);


        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].userName").value("danielC"))
                .andExpect(jsonPath("$[1].userName").value("aliceA"));
    }

    @Test
    void getAll_empty_shouldReturn200() throws Exception {

        when(userService.getAllUsers()).thenReturn(List.of());


        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }


    @Test
    void getById_nominal_shouldReturn200() throws Exception {

        User user = User.builder()
                .id(1L).email("daniel@example.com").userName("danielC")
                .firstName("Daniel").lastName("C").build();
        when(userService.getUserById(1L)).thenReturn(user);


        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("daniel@example.com"))
                .andExpect(jsonPath("$.userName").value("danielC"));
    }

    @Test
    void getById_userNotFound_shouldReturn404() throws Exception {

        when(userService.getUserById(99L))
                .thenThrow(new NoSuchElementException());


        mockMvc.perform(get("/api/users/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("NOT_FOUND"));
    }


    @Test
    void update_nominal_shouldReturn200() throws Exception {

        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setFirstName("Daniel");
        dto.setLastName("Updated");
        dto.setCity("Lyon");

        User updated = User.builder()
                .id(1L).email("daniel@example.com").userName("danielC")
                .firstName("Daniel").lastName("Updated").city("Lyon").build();

        when(userService.updateUser(eq(1L), any(UpdateUserDTO.class))).thenReturn(updated);


        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Updated"))
                .andExpect(jsonPath("$.city").value("Lyon"));
    }

    @Test
    void update_userNotFound_shouldReturn404() throws Exception {

        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setFirstName("Daniel");

        when(userService.updateUser(eq(99L), any(UpdateUserDTO.class)))
                .thenThrow(new NoSuchElementException());


        mockMvc.perform(put("/api/users/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("NOT_FOUND"));
    }


    @Test
    void searchUsers_noParams_shouldReturn200() throws Exception {

        List<UserSearchDTO> results = List.of(
                new UserSearchDTO(1L, "Daniel", "C", "danielC", "Lyon", "France", null, null, null, List.of()),
                new UserSearchDTO(2L, "Alice", "A", "aliceA", "Paris", "France", null, null, null, List.of())
        );
        when(userService.searchUsers(null, null, null)).thenReturn(results);


        mockMvc.perform(get("/api/users/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void searchUsers_withSkill_shouldReturn200() throws Exception {

        List<UserSearchDTO> results = List.of(
                new UserSearchDTO(1L, "Daniel", "C", "danielC", "Lyon", "France", null, null, null, List.of())
        );
        when(userService.searchUsers("Java", null, null)).thenReturn(results);


        mockMvc.perform(get("/api/users/search?skill=Java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].userName").value("danielC"));
    }

    @Test
    void searchUsers_withCity_shouldReturn200() throws Exception {

        List<UserSearchDTO> results = List.of(
                new UserSearchDTO(1L, "Daniel", "C", "danielC", "Lyon", "France", null, null, null, List.of())
        );
        when(userService.searchUsers(null, "Lyon", null)).thenReturn(results);


        mockMvc.perform(get("/api/users/search?city=Lyon"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].city").value("Lyon"));
    }


}
