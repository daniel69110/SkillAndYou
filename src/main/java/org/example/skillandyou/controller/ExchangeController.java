package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.ExchangeDTO;
import org.example.skillandyou.entity.Exchange;
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

    @GetMapping("/requester/{userId}")
    public List<ExchangeDTO> getByRequester(@PathVariable Long userId) {
        return exchangeService.getExchangesByRequester(userId);
    }

    @GetMapping("/receiver/{userId}")
    public List<ExchangeDTO> getByReceiver(@PathVariable Long userId) {
        return exchangeService.getExchangesByReceiver(userId);
    }

    @PostMapping
    public ExchangeDTO create(@RequestBody Exchange exchange) {
        return exchangeService.createExchange(exchange);
    }
}
