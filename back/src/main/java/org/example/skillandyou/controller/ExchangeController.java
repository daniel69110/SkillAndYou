package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.AccepteExchangeRequestDTO;
import org.example.skillandyou.dto.CreateExchangeRequestDTO;
import org.example.skillandyou.dto.ExchangeDTO;
import org.example.skillandyou.service.ExchangeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExchangeController {

    private final ExchangeService exchangeService;

    @GetMapping
    public List<ExchangeDTO> getAll() {
        return exchangeService.getAllExchanges();
    }

    @GetMapping("/{id}")
    public ExchangeDTO getExchangeById(@PathVariable Long id) {
        return exchangeService.getExchangeById(id);
    }

    @GetMapping("/requester/{userId}")
    public List<ExchangeDTO> getByRequester(@PathVariable Long userId) {
        return exchangeService.getExchangesByRequester(userId);
    }

    @GetMapping("/receiver/{userId}")
    public List<ExchangeDTO> getByReceiver(@PathVariable Long userId) {
        return exchangeService.getExchangesByReceiver(userId);
    }

    @PostMapping
    public ExchangeDTO create(@RequestBody CreateExchangeRequestDTO request) {
        return exchangeService.createExchange(request);
    }

    @PutMapping("/{id}/accept")
    public ExchangeDTO accept(@PathVariable Long id, @RequestBody AccepteExchangeRequestDTO request) {
        return exchangeService.acceptExchange(id, request.getReceiverId());
    }

    @PutMapping("/{id}/complete")
    public ExchangeDTO complete(@PathVariable Long id) {
        return exchangeService.completeExchange(id);
    }

    @PutMapping("/{id}/cancel")
    public ExchangeDTO cancel(@PathVariable Long id) {
        return exchangeService.cancelExchange(id);
    }



}
