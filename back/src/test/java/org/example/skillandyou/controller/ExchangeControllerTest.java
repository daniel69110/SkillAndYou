package org.example.skillandyou.controller;

import jakarta.persistence.EntityNotFoundException;
import org.example.skillandyou.dto.*;
import org.example.skillandyou.security.JwtAuthFilter;
import org.example.skillandyou.security.JwtUtil;
import org.example.skillandyou.security.SecurityConfig;
import org.example.skillandyou.security.suspensionCheckFilter;
import org.example.skillandyou.service.ExchangeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = { ExchangeController.class, GlobalExceptionHandler.class },
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
class ExchangeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = JsonMapper.builder().build();

    @MockitoBean
    private ExchangeService exchangeService;

    @MockitoBean
    private JwtUtil jwtUtil;

    private ExchangeDTO makeExchangeDTO(Long id, String status) {
        UserSummaryDTO requester = new UserSummaryDTO(1L, "danielC", "Daniel", "C");
        UserSummaryDTO receiver  = new UserSummaryDTO(2L, "aliceA",  "Alice",  "A");
        SkillDTO offeredSkill    = new SkillDTO(1L, "Java",   "Dev", null);
        SkillDTO requestedSkill  = new SkillDTO(2L, "Python", "Dev", null);
        return new ExchangeDTO(id, requester, receiver, offeredSkill, requestedSkill,
                status, LocalDateTime.now(), null, null);
    }

    @Test
    void getAll_shouldReturn200WithList() throws Exception {
        when(exchangeService.getAllExchanges()).thenReturn(List.of(
                makeExchangeDTO(1L, "PENDING"),
                makeExchangeDTO(2L, "ACCEPTED")
        ));

        mockMvc.perform(get("/api/exchanges"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].status").value("PENDING"))
                .andExpect(jsonPath("$[1].status").value("ACCEPTED"));
    }

    @Test
    void getAll_empty_shouldReturn200() throws Exception {
        when(exchangeService.getAllExchanges()).thenReturn(List.of());

        mockMvc.perform(get("/api/exchanges"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }


    @Test
    void getById_nominal_shouldReturn200() throws Exception {
        when(exchangeService.getExchangeById(1L)).thenReturn(makeExchangeDTO(1L, "PENDING"));

        mockMvc.perform(get("/api/exchanges/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.requester.userName").value("danielC"));
    }

    @Test
    void getById_notFound_shouldReturn404() throws Exception {
        when(exchangeService.getExchangeById(99L))
                .thenThrow(new EntityNotFoundException("Exchange not found"));

        mockMvc.perform(get("/api/exchanges/99"))
                .andExpect(status().isNotFound());
    }


    @Test
    void getByRequester_shouldReturn200() throws Exception {
        when(exchangeService.getExchangesByRequester(1L))
                .thenReturn(List.of(makeExchangeDTO(1L, "PENDING")));

        mockMvc.perform(get("/api/exchanges/requester/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].requester.id").value(1));
    }


    @Test
    void getByReceiver_shouldReturn200() throws Exception {
        when(exchangeService.getExchangesByReceiver(2L))
                .thenReturn(List.of(makeExchangeDTO(1L, "PENDING")));

        mockMvc.perform(get("/api/exchanges/receiver/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].receiver.id").value(2));
    }


    @Test
    void create_nominal_shouldReturn200() throws Exception {
        CreateExchangeRequestDTO req = new CreateExchangeRequestDTO(1L, 2L, 1L, 2L);
        when(exchangeService.createExchange(any(CreateExchangeRequestDTO.class)))
                .thenReturn(makeExchangeDTO(1L, "PENDING"));

        mockMvc.perform(post("/api/exchanges")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.requester.userName").value("danielC"));
    }

    @Test
    void create_userNotFound_shouldReturn404() throws Exception {
        CreateExchangeRequestDTO req = new CreateExchangeRequestDTO(99L, 2L, 1L, 2L);
        when(exchangeService.createExchange(any(CreateExchangeRequestDTO.class)))
                .thenThrow(new EntityNotFoundException("Requester not found"));

        mockMvc.perform(post("/api/exchanges")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }


    @Test
    void accept_nominal_shouldReturn200() throws Exception {
        AccepteExchangeRequestDTO req = new AccepteExchangeRequestDTO(2L);
        when(exchangeService.acceptExchange(eq(1L), eq(2L)))
                .thenReturn(makeExchangeDTO(1L, "ACCEPTED"));

        mockMvc.perform(put("/api/exchanges/1/accept")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));
    }

    @Test
    void accept_wrongReceiver_shouldReturn400() throws Exception {
        AccepteExchangeRequestDTO req = new AccepteExchangeRequestDTO(99L);
        when(exchangeService.acceptExchange(anyLong(), anyLong()))
                .thenThrow(new IllegalStateException("Seul le receiver peut accepter"));

        mockMvc.perform(put("/api/exchanges/1/accept")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }


    @Test
    void complete_nominal_shouldReturn200() throws Exception {
        when(exchangeService.completeExchange(1L))
                .thenReturn(makeExchangeDTO(1L, "COMPLETED"));

        mockMvc.perform(put("/api/exchanges/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void complete_notAccepted_shouldReturn400() throws Exception {
        when(exchangeService.completeExchange(anyLong()))
                .thenThrow(new IllegalStateException("Seul ACCEPTED peut être complété"));

        mockMvc.perform(put("/api/exchanges/1/complete"))
                .andExpect(status().isBadRequest());
    }


    @Test
    void cancel_nominal_shouldReturn200() throws Exception {
        when(exchangeService.cancelExchange(1L))
                .thenReturn(makeExchangeDTO(1L, "CANCELLED"));

        mockMvc.perform(put("/api/exchanges/1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    void cancel_alreadyCompleted_shouldReturn400() throws Exception {
        when(exchangeService.cancelExchange(anyLong()))
                .thenThrow(new IllegalStateException("COMPLETED ne peut être annulé"));

        mockMvc.perform(put("/api/exchanges/1/cancel"))
                .andExpect(status().isBadRequest());
    }
}
